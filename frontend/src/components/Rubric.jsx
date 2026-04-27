import RubricButton from "./Work/RubricButton";

export default function Rubric({ criterias, levels, cells, setModalData, readOnly = false }) {
    const rowCount = criterias.length + 1;
    const colCount = levels.length + 1;

    const handleUpdateSize = (isRow, isPlus) => {
        setModalData(p => {
            let newCriterias = [...p.rubricCriterias];
            let newLevels = [...p.rubricLevels];
            let newCells = p.rubricCells.map(row => [...row]);

            if (isRow) {
                if (isPlus) {
                    newCriterias.push('');
                    newCells.push(new Array(newLevels.length).fill(''));
                } else if (newCriterias.length > 1) {
                    newCriterias.pop();
                    newCells.pop();
                }
            } else {
                if (isPlus) {
                    newLevels.push('');
                    newCells = newCells.map(row => [...row, '']);
                } else if (newLevels.length > 1) {
                    newLevels.pop();
                    newCells = newCells.map(row => row.slice(0, -1));
                }
            }
            return {
                ...p,
                rubricCriterias: newCriterias,
                rubricLevels: newLevels,
                rubricCells: newCells
            };
        });
    };

    const handleBlur = (rowIndex, colIndex, value) => {
        setModalData(p => {
            const newCriterias = [...p.rubricCriterias];
            const newLevels = [...p.rubricLevels];
            const newCells = p.rubricCells.map(row => [...row]);

            if (rowIndex === 0) {
                newLevels[colIndex - 1] = value;
            } else if (colIndex === 0) {
                newCriterias[rowIndex - 1] = value;
            } else {
                newCells[rowIndex - 1][colIndex - 1] = value;
            }

            return {
                ...p,
                rubricCriterias: newCriterias,
                rubricLevels: newLevels,
                rubricCells: newCells
            };
        });
    };

    return (
        <div className="rubrics-config-section">
            {!readOnly && (
                <>
                    <div className="rubrics-config-header">
                        Rubrics
                        <div className="rubrics-config-controls">
                            Rows:
                            <RubricButton onClick={() => handleUpdateSize(true, false)} />
                            <span id="rubric-rows-assign">{rowCount}</span>
                            <RubricButton isPlus onClick={() => handleUpdateSize(true, true)} />
                        </div>
                        <div className="rubrics-config-controls">
                            Columns:
                            <RubricButton onClick={() => handleUpdateSize(false, false)} />
                            <span id="rubric-cols-assign">{colCount}</span>
                            <RubricButton isPlus onClick={() => handleUpdateSize(false, true)} />
                        </div>
                    </div>

                    <p className="rubric-tip">
                        <b>Tip:</b> Rows represent <b>Criteria</b>, while columns represent <b>Levels</b>.
                        <br /> (Left columns = Good / Right columns = Bad)
                    </p>
                </>
            )}

            {/* Table */}
            <div className="rubrics-table-wrapper">
                <table className="rubrics-input-table">
                    <tbody id="rubric-table-assign">
                        {[...Array(rowCount)].map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {[...Array(colCount)].map((_, colIndex) => {
                                    const isOrigin = rowIndex === 0 && colIndex === 0;
                                    const isLevel = rowIndex === 0;
                                    const isCriteria = colIndex === 0;

                                    let content = "";
                                    if (isOrigin) content = "Criteria \\ Level";
                                    else if (isLevel) content = levels[colIndex - 1];
                                    else if (isCriteria) content = criterias[rowIndex - 1];
                                    else content = cells[rowIndex - 1][colIndex - 1];

                                    return (
                                        <td
                                            key={colIndex}
                                            contentEditable={!readOnly && !isOrigin}
                                            className={`rubrics-input-cell ${isOrigin ? 'rubric-origin' : (isCriteria || isLevel) ? 'rubric-header' : ''}`}
                                            onBlur={(e) => !readOnly && handleBlur(rowIndex, colIndex, e.currentTarget.innerText)}
                                            suppressContentEditableWarning={true}
                                        >
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}