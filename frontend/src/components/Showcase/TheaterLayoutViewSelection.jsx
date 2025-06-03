import React, { useEffect, useState } from "react";
import axios from "axios";

const SEAT_TYPES = {
    STANDARD: { label: "Standard", color: "bg-purple-600", selectedColor: "bg-blue-600" },
    VIP: { label: "VIP", color: "bg-red-600", selectedColor: "bg-blue-600" },
    COUPLE: { label: "Couple", color: "bg-pink-600", selectedColor: "bg-blue-600" },
    DISABLED: { label: "Booked", color: "bg-gray-500" },
};

const TheaterLayoutViewSelection = ({ 
    screen, 
    selectedSeats = [], 
    onSeatClick,
    maxSeats = 8,
    showLegend = true 
}) => {
    const [seatMap, setSeatMap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const getSeats = async (screenCode, cinemaCode) => {

            try {
                setLoading(true);
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

                        const isBooked = seat.status !== "AVAILABLE";
                        const isSelected = selectedSeats?.includes(seat.seatCode);

                        if (seat.type === "COUPLE") {
                            rowSeats.push({
                                type: "COUPLE",
                                disabled: isBooked,
                                selected: isSelected,
                                span: 2,
                                seatCode: seat.seatCode,
                                number: col,
                                row: rowLabel,
                                price: seat.price || 0
                            });
                            col++; // Skip next column for couple seats
                            continue;
                        }

                        rowSeats.push({
                            type: seat.type,
                            disabled: isBooked,
                            selected: isSelected,
                            seatCode: seat.seatCode,
                            number: col,
                            row: rowLabel,
                            price: seat.price || 0
                        });
                    }
                    return rowSeats;
                });

                setSeatMap(newSeatMap);
                setError(null);
            } catch (e) {
                console.error("Error fetching seats", e);
                setError("Failed to load seats. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (screen?.screenCode && screen?.cinemaCode) {
            getSeats(screen.screenCode, screen.cinemaCode);
        }
    }, [screen, selectedSeats]);

    const handleSeatClick = (seat) => {
        if (seat.disabled || !onSeatClick) return;
        
        if (!seat.selected && selectedSeats.length >= maxSeats) {
            // Show warning about max seats
            return;
        }
        
        onSeatClick(seat.seatCode);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="mt-4 text-white">Loading seats...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full select-none">
            {/* Screen */}
            <div className="w-3/4 mb-8">
                <div className="h-2 bg-white rounded-t-lg w-full shadow-lg shadow-white/30"></div>
                <div className="text-center text-gray-400 text-sm mt-2">SCREEN</div>
            </div>

            {/* Seats */}
            <div className="w-full">
                {seatMap.map((row, rowIndex) => {
                    const rowLabel = String.fromCharCode(65 + rowIndex);
                    return (
                        <div key={rowIndex} className="flex justify-center my-2">
                            <div className="w-8 flex items-center justify-center font-bold mr-2 text-gray-400">
                                {rowLabel}
                            </div>
                            <div className="flex space-x-2 flex-wrap justify-center">
                                {row.map((seat, seatIndex) => {
                                    if (seat.type === "COUPLE" && seat.isRightPart) return null;

                                    let color;
                                    if (seat.disabled) {
                                        color = "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50";
                                    } else if (seat.selected) {
                                        color = `${SEAT_TYPES[seat.type].selectedColor} border-2 border-white text-white`;
                                    } else {
                                        color = `${SEAT_TYPES[seat.type].color} hover:opacity-80 text-white`;
                                    }

                                    const seatSpan = seat.type === "COUPLE" ? "w-16" : "w-8";

                                    return (
                                        <div
                                            key={seatIndex}
                                            className={`${seatSpan} h-8 rounded flex items-center justify-center text-xs cursor-pointer transition-all duration-200 ${color} ${!seat.disabled && 'hover:scale-105'}`}
                                            onClick={() => handleSeatClick(seat)}
                                            title={`${rowLabel}${seat.number} - ${seat.type} - ${seat.price.toLocaleString()}đ`}
                                        >
                                            {seat.number}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="mt-8 flex space-x-6 text-sm flex-wrap justify-center">
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-2 bg-gray-500 opacity-50"></div>
                        <span className="text-gray-300">Booked</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-2 bg-purple-600"></div>
                        <span className="text-gray-300">Standard</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-2 bg-red-600"></div>
                        <span className="text-gray-300">VIP</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-2 bg-pink-600"></div>
                        <span className="text-gray-300">Couple</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-2 bg-blue-600 border border-white"></div>
                        <span className="text-gray-300">Selected</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TheaterLayoutViewSelection; 