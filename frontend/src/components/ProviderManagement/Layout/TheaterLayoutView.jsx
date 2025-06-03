import { Button } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

const SEAT_TYPES = {
    STANDARD: { label: "Standard", color: "bg-gray-200" },
    VIP: { label: "VIP", color: "bg-yellow-300" },
    COUPLE: { label: "Couple", color: "bg-purple-300" },
    DISABLED: { label: "Disable", color: "bg-gray-400" },
};

const TheaterLayoutView = ({ screen }) => {
    const [seatMap, setSeatMap] = useState([]);
    const [currentType, setCurrentType] = useState(null);

    useEffect(() => {
        const getSeats = async (screenCode, cinemaCode) => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/seats/v2/?cinema=${cinemaCode}&screen=${screenCode}`, 
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*'
                        },
                        withCredentials: true
                    }
                );
                const seatData = res.data;
                const allRows = [...new Set(seatData.map((s) => s.row))].sort();
                console.log(allRows)
                const maxCols = Math.max(...seatData.map(seat => parseInt(seat.number)));
                const newSeatMap = allRows.map((rowLabel) => {
                    const rowSeats = [];
                    for (let col = 1; col <= maxCols; col++) {
                        const seat = seatData.find(
                            (s) => s.row === rowLabel && parseInt(s.number) === col
                        );
                        if (!seat) {
                            rowSeats.push({ type: "STANDARD", disabled: true });
                            continue;
                        }

                        const isDisabled = seat.status !== "AVAILABLE";

                        // Ghế đôi:
                        if (seat.type === "COUPLE") {
                            rowSeats.push({
                                type: "COUPLE",
                                disabled: isDisabled,
                                span: 2,
                                seatCode: seat.seatCode,
                            });
                            col++;
                            continue;
                        }

                        rowSeats.push({
                            type: seat.type,
                            disabled: isDisabled,
                        });
                    }
                    return rowSeats;
                });

                setSeatMap(newSeatMap);
            } catch (e) {
                console.error("Error fetching seats", e);
            }
        };

        if (screen?.screenCode && screen?.cinemaCode) {
            getSeats(screen.screenCode, screen.cinemaCode);
        }
    }, [screen]);

    return (
        <div className="flex flex-col items-center w-full select-none">
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
                                    if (seat.type === "COUPLE" && seat.isRightPart) return null;

                                    const color = seat.disabled
                                        ? SEAT_TYPES.DISABLED.color
                                        : SEAT_TYPES[seat.type]?.color || SEAT_TYPES.STANDARD.color;

                                    const seatSpan = seat.type === "COUPLE" ? "w-16" : "w-8";

                                    return (
                                        <div
                                            key={seatIndex}
                                            className={`${seatSpan} h-8 rounded flex items-center justify-center text-xs cursor-default transition-colors ${color}`}
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

            {/* Chú thích loại ghế */}
            <div className="mt-8 flex space-x-6 text-sm flex-wrap justify-center">
                {Object.entries(SEAT_TYPES).map(([key, value]) => (
                    <Button
                        key={key}
                        className="flex items-center"
                        style={{ border: "none", boxShadow: "none" }}
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

export default TheaterLayoutView;
