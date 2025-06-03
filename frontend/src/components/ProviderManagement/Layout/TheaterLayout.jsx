import React, {useState, useRef, useEffect} from "react";
import {Button, Select} from "antd";

const SEAT_TYPES = {
    STANDARD: {label: "Standard", color: "bg-gray-200"},
    VIP: {label: "VIP", color: "bg-yellow-300"},
    COUPLE: {label: "Couple", color: "bg-purple-300"},
    DISABLED: {label: "Disable", color: "bg-gray-400"},
};


const generateInitialSeats = (rows, seatsPerRow, editable=false, screen=null) => {
    const newSeats = [];
    for (let i = 0; i < rows; i++) {
        const rowSeats = [];
        for (let j = 0; j < seatsPerRow; j++) {
            rowSeats.push({
                id: `${String.fromCharCode(65 + i)}${j + 1}`,
                type: 'STANDARD',
                disabled: false,
                row: String.fromCharCode(65 + i)
            });
        }
        newSeats.push(rowSeats);
    }
    return newSeats;
};

const TheaterLayout = ({rows, seatsPerRow, onSeatChange}) => {
    const [seatMap, setSeatMap] = useState(() =>
        Array.from({length: rows}, (_, rowIndex) =>
            Array.from({length: seatsPerRow}, () => ({
                type: "STANDARD",
                isRightPart: false,
                disabled: false,
            }))
        )
    );

    useEffect(() => {
        setSeatMap(generateInitialSeats(rows, seatsPerRow));
    }, [rows, seatsPerRow]);


    useEffect(() => {
        if (onSeatChange) {
            onSeatChange(seatMap);
        }
    }, [seatMap]);

    const [currentType, setCurrentType] = useState("VIP");
    const [disableMode, setDisableMode] = useState(false);
    const isDragging = useRef(false);

    const handleMouseDown = (row, col) => {
        isDragging.current = true;
        updateSeat(row, col);
    };

    const handleMouseEnter = (row, col) => {
        if (isDragging.current) {
            updateSeat(row, col);
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const getRowLetter = (rowIndex) => String.fromCharCode(65 + rowIndex);

    const updateSeat = (row, col) => {
        setSeatMap(prev => {
            const newMap = [...prev.map(r => [...r.map(s => ({...s}))])];

            const seat = newMap[row][col];

            if (disableMode) {
                newMap[row][col].disabled = !seat.disabled;
                return newMap;
            }

            if (currentType === "COUPLE") {
                if (seat.type === "COUPLE" && seat.isRightPart === false) {
                    // Reset ghế bên trái và phải
                    newMap[row][col] = {
                        id: `${String.fromCharCode(65 + row)}${col + 1}`,
                        type: "STANDARD",
                        isRightPart: false,
                        disabled: false,
                        row: getRowLetter(row)
                    };
                    if (col + 1 < seatsPerRow) {
                        newMap[row][col + 1] = {
                            id: `${String.fromCharCode(65 + row)}${col + 2}`,
                            type: "STANDARD",
                            isRightPart: false,
                            disabled: false,
                            row: getRowLetter(row)
                        };
                    }
                    return newMap;
                }

                // Không cho chọn nếu tràn hoặc đang là COUPLE
                if (
                    col >= seatsPerRow - 1 ||
                    seat.disabled ||
                    newMap[row][col + 1].disabled ||
                    seat.type === "COUPLE" ||
                    newMap[row][col + 1].type === "COUPLE"
                ) {
                    return newMap;
                }

                // Gán COUPLE
                newMap[row][col] = {
                    id: `${String.fromCharCode(65 + row)}${col + 1}`,
                    type: "COUPLE",
                    isRightPart: false,
                    disabled: false,
                    row: getRowLetter(row)
                };
                newMap[row][col + 1] = {
                    id: `${String.fromCharCode(65 + row)}${col + 2}`,
                    type: "COUPLE",
                    isRightPart: true,
                    disabled: false,
                    row: getRowLetter(row)
                };



            } else {
                // Nếu click vào ghế đã có type giống currentType → reset
                if (seat.type === currentType && !seat.isRightPart) {
                    newMap[row][col] = {
                        id: `${String.fromCharCode(65 + row)}${col + 1}`,
                        type: "STANDARD",
                        isRightPart: false,
                        disabled: false,
                        row: getRowLetter(row)
                    };
                } else if (!seat.isRightPart) {
                    newMap[row][col] = {
                        id: `${String.fromCharCode(65 + row)}${col + 1}`,
                        type: currentType,
                        isRightPart: false,
                        disabled: false,
                        row: getRowLetter(row)
                    };
                    console.log(row, col, newMap[row][col], newMap[row][col-1])
                }
            }

            return newMap;
        });
    };


    return (
        <div
            className="flex flex-col items-center w-full select-none"
            onMouseUp={handleMouseUp}
        >
            {/* Màn hình */}
            <div className="w-3/4 mb-8">
                <div className="h-2 bg-red-800 rounded-t-lg w-full"></div>
                <div className="text-center text-gray-500 text-sm mt-2">Screen</div>
            </div>

            {/* Ghế */}
            <div className="w-full">
                {seatMap.map((row, rowIndex) => {
                    const rowLabel = String.fromCharCode(65 + rowIndex);
                    return (
                        <div key={rowIndex} className="flex justify-center my-2">
                            <div className="w-8 flex items-center justify-center font-bold mr-2">
                                {rowLabel}
                            </div>
                            <div className="flex space-x-2 flex-wrap justify-center">
                                {row.map((seat, seatIndex) => {
                                    const color =
                                        seat.disabled
                                            ? SEAT_TYPES.DISABLED.color
                                            : SEAT_TYPES[seat.type].color;

                                    if (seat.type === "COUPLE" && seat.isRightPart) return null;

                                    const seatSpan =
                                        seat.type === "COUPLE" ? "w-16" : "w-8";

                                    return (
                                        <div
                                            key={seatIndex}
                                            className={`${seatSpan} h-8 rounded flex items-center justify-center text-xs cursor-pointer transition-colors ${color}`}
                                            onMouseDown={() => handleMouseDown(rowIndex, seatIndex)}
                                            onMouseEnter={() => handleMouseEnter(rowIndex, seatIndex)}
                                        >
                                            {seatIndex + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-8 flex space-x-6 text-sm flex-wrap justify-center">
                {Object.entries(SEAT_TYPES).map(([key, value]) => (
                    <Button
                        key={key}
                        className="flex items-center"
                        style={{border: "none", boxShadow: "none"}}
                        onClick={() => setCurrentType(key)}
                    >
                        <div className={`w-4 h-4 rounded mr-2 ${value.color}`}></div>
                        <span>{value.label}</span>
                    </Button>
                ))}
            </div>

        </div>
    );
};

export default TheaterLayout;