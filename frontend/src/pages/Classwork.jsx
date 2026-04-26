import WorkPost from "../components/WorkPost"



export default function Classwork() {
    return (
        <>
            {/* Classwork Content */}
            <section className="stream-content stream-content-scrollable">
                <div id="assignments-container" className="posts-container">
                    {/* Assignment 1 */}
                    <WorkPost title='Group Project' date='31 DEC' />

                    {/* Assignment 2 */}
                    <WorkPost title='Homework1' date='21 SEP' />
                </div>

            </section>

            {/* Assign Button */}
            <button id="btn-assign" className="btn-compose btn-assign-custom">
                <span className="btn-assign-icon">+</span> Assign
            </button>
        </>


    )
}