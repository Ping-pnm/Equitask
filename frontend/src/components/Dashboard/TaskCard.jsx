import React from 'react';
import taskSign from '../../assets/taskSign.png';
import aiSign from '../../assets/Ai-sign.png';

const TaskItem = ({ studentName, task, onOpenDetail }) => {
    const getStatusStyles = (status) => {
        switch (status?.toUpperCase()) {
            case 'IN PROGRESS':
                return { background: '#fae489', color: '#111', fontWeight: '700' };
            case 'AT RISK':
                return { background: '#fcb0a3', color: '#111', fontWeight: '700' };
            case 'SUCCESS':
                return { background: '#5ec390', color: 'white', fontWeight: '700' };
            default:
                return { background: 'transparent', color: '#111', fontWeight: '600' };
        }
    };

    const statusStyle = getStatusStyles(task.status);

    return (
        <div onClick={() => onOpenDetail(studentName, task.name)}
            style={{ background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '15px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src={taskSign} alt="Task" style={{ width: '22px', height: '22px' }} />
                    <span style={{ fontSize: '18px', color: '#333' }}>
                        {task.name} <span style={{ fontWeight: '800' }}>&gt;</span>
                    </span>
                </div>
                <div style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', ...statusStyle }}>
                    {task.status || 'WAITING'}
                </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: '1', height: '6px', background: '#E9ECEF', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${task.progress}%`, background: '#6ba7c2', borderRadius: '4px' }}></div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#222' }}>{task.progress}%</span>
            </div>

            {task.aiSummary && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700' }}>
                        <img src={aiSign} alt="AI Icon" style={{ width: '14px', height: '14px' }} />
                        <span className="ai-summary-text-gradient ai-summary-text-gradient-small">AI Summary</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#444', lineHeight: '1.3' }}>{task.aiSummary}</span>
                </div>
            )}
        </div>
    );
};

const StudentProgressCard = ({ name, overallProgress, tasks, onAddTask, onOpenDetail }) => {
    const circumference = 188.5;
    const dashOffset = circumference * (1 - overallProgress / 100);

    return (
        <div style={{ background: '#e8eaeb', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 25px 0', color: '#222' }}>{name}</h3>

            <div style={{ position: 'relative', width: '160px', height: '85px', margin: '0 auto 20px' }}>
                <svg width="160" height="85" viewBox="0 0 160 85">
                    <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="white" strokeWidth="20" strokeLinecap="round" />
                    <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#2AB3D6"
                        strokeWidth="20" strokeLinecap="round" strokeDasharray={circumference}
                        strokeDashoffset={dashOffset} />
                </svg>
                <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#111' }}>
                    {overallProgress}%
                </div>
            </div>

            {tasks && tasks.map((task, index) => (
                <TaskItem key={index} studentName={name} task={task} onOpenDetail={onOpenDetail} />
            ))}

            <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                <button onClick={() => onAddTask(name)}
                    style={{ background: 'transparent', border: 'none', color: '#4bc4de', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                    Add Task
                </button>
            </div>
        </div>
    );
};

const TaskCard = ({ studentsData, onAddTask, onOpenDetail }) => {
    if (!studentsData) return null;

    return (
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '25px', 
            rowGap: '35px',
            width: '100%', 
            justifyContent: 'center',
            marginBottom: '50px' 
        }}>
            {studentsData.map((student, index) => (
                <StudentProgressCard
                    key={index}
                    name={student.name}
                    overallProgress={student.overallProgress}
                    tasks={student.tasks}
                    onAddTask={onAddTask}
                    onOpenDetail={onOpenDetail}
                />
            ))}
        </div>
    );
};

export default TaskCard;