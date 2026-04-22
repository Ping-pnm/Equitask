import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsDir = path.join(__dirname, 'views');
const publicDir = path.join(__dirname, 'public');

// middleware
app.use(express.json());
app.use('/public', express.static(publicDir));

// ---- In-memory demo data (replace with DB later) ----
const demo = {
    classes: [
        { id: 'class-1', name: 'Class 1' },
        { id: 'class-2', name: 'Class 2' },
    ],
    rosters: {
        'class-1': [
            { id: 'stu-1', fullName: 'Phinnawat Yaemsanguan' },
            { id: 'stu-2', fullName: 'Rangsimann Sattayarom' },
            { id: 'stu-3', fullName: 'Napha Mongkolwittayakul' },
            { id: 'stu-4', fullName: 'Takorn Sripetcharakul' },
        ],
        'class-2': [
            { id: 'stu-5', fullName: 'Student Two A' },
            { id: 'stu-6', fullName: 'Student Two B' },
            { id: 'stu-7', fullName: 'Student Two C' },
        ],
    },
    assignments: {
        'class-1': [
            { id: 'group-project', title: 'Group Project', dueDate: '31 Dec', points: 100 },
            { id: 'hw1', title: 'Homework 1', dueDate: '20 Nov', points: 10 },
        ],
        'class-2': [
            { id: 'hw1', title: 'Homework 1', dueDate: '20 Nov', points: 10 },
        ],
    },
    homework: {
        // single assignment details for hw1
        hw1: {
            id: 'hw1',
            title: 'Homework 1',
            dueDate: '20 NOV',
            points: 10,
            descriptionTitle: 'Homework Assignment 1',
            bullets: ['Make sure to write down the answer appropriately.'],
            attachments: [{ id: 'att-1', name: 'Homework1', type: 'PDF' }],
            ai: {
                rubrics: [
                    ['xxxx', 'xxxx', 'xxxx'],
                    ['xxxx', '', ''],
                    ['xxxx', '', ''],
                ],
                summaryText: 'According to the rubric, I suggest you to edit,...',
            },
        },
    },
    // one status per student per assignment for simplicity
    submissions: {
        'class-1': {
            hw1: {
                'stu-1': { status: 'graded', grade: 92, workItems: [{ type: 'github', name: 'Name', label: 'Github' }] },
                'stu-2': { status: 'turned_in', grade: null, workItems: [{ type: 'github', name: 'Name', label: 'Github' }] },
                'stu-3': { status: 'turned_in', grade: null, workItems: [] },
                'stu-4': { status: 'assigned', grade: null, workItems: [] },
            },
        },
        'class-2': {
            hw1: {
                'stu-5': { status: 'assigned', grade: null, workItems: [] },
                'stu-6': { status: 'turned_in', grade: null, workItems: [] },
                'stu-7': { status: 'graded', grade: 80, workItems: [{ type: 'github', name: 'Repo', label: 'Github' }] },
            },
        },
    },
};

function getClassOr404(classId) {
    const cls = demo.classes.find(c => c.id === classId);
    return cls || null;
}

function getRoster(classId) {
    return demo.rosters[classId] || [];
}

function getSubmission(classId, assignmentId, studentId) {
    return demo.submissions?.[classId]?.[assignmentId]?.[studentId] || { status: 'assigned', grade: null, workItems: [] };
}

function bucketFromStatus(status) {
    if (status === 'graded') return 'graded';
    if (status === 'turned_in') return 'turnedIn';
    return 'assigned';
}

// ---- Views (static HTML) ----
app.get('/', (req, res) => res.redirect('/views/dashboard.html'));
app.get('/views/:page', (req, res) => {
    const page = req.params.page;
    // minimal allowlist for safety
    const allowed = new Set(['login.html', 'register.html', 'homepage.html', 'classwork.html', 'people.html', 'dashboard.html']);
    if (!allowed.has(page)) return res.status(404).send('Not found');
    return res.sendFile(path.join(viewsDir, page));
});

// ---- API ----
app.get('/api/classes', (req, res) => {
    res.json(demo.classes);
});

app.get('/api/classes/:classId/assignments', (req, res) => {
    const { classId } = req.params;
    if (!getClassOr404(classId)) return res.status(404).json({ error: 'class_not_found' });
    res.json(demo.assignments[classId] || []);
});

app.get('/api/classes/:classId/assignments/:assignmentId/dashboard', (req, res) => {
    const { classId, assignmentId } = req.params;
    if (!getClassOr404(classId)) return res.status(404).json({ error: 'class_not_found' });

    const roster = getRoster(classId);
    const assignment = demo.homework[assignmentId];
    if (!assignment) return res.status(404).json({ error: 'assignment_not_found' });

    const lists = { assigned: [], turnedIn: [], graded: [] };
    roster.forEach(s => {
        const sub = getSubmission(classId, assignmentId, s.id);
        const bucket = bucketFromStatus(sub.status);
        const row = { id: s.id, fullName: s.fullName };
        if (bucket === 'graded') lists.graded.push(row);
        else if (bucket === 'turnedIn') lists.turnedIn.push(row);
        else lists.assigned.push(row);
    });

    res.json({
        assignment: {
            id: assignment.id,
            title: assignment.title,
            dueDate: assignment.dueDate,
            points: assignment.points,
            descriptionTitle: assignment.descriptionTitle,
            bullets: assignment.bullets,
            attachments: assignment.attachments,
        },
        counts: {
            assigned: lists.assigned.length,
            turnedIn: lists.turnedIn.length,
            graded: lists.graded.length,
        },
        lists,
    });
});

app.get('/api/classes/:classId/assignments/:assignmentId/students/:studentId', (req, res) => {
    const { classId, assignmentId, studentId } = req.params;
    if (!getClassOr404(classId)) return res.status(404).json({ error: 'class_not_found' });

    const assignment = demo.homework[assignmentId];
    if (!assignment) return res.status(404).json({ error: 'assignment_not_found' });

    const roster = getRoster(classId);
    const student = roster.find(s => s.id === studentId);
    if (!student) return res.status(404).json({ error: 'student_not_found' });

    const submission = getSubmission(classId, assignmentId, studentId);

    res.json({
        breadcrumb: { assignmentTitle: assignment.title, studentName: student.fullName },
        assignment: {
            id: assignment.id,
            title: assignment.title,
            dueDate: assignment.dueDate,
            points: assignment.points,
            descriptionTitle: assignment.descriptionTitle,
            bullets: assignment.bullets,
            attachments: assignment.attachments,
        },
        submission: {
            status: submission.status,
            grade: submission.grade,
            workItems: submission.workItems || [],
        },
        ai: assignment.ai,
        privateComments: [],
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});