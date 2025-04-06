export const getEndTime = (startTime, duration) => {
    if (!startTime || typeof duration !== 'number' || !startTime.includes(':')) {
        return '?';
    }
    try {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endMinutes = minutes + duration;
        let endHours = hours + Math.floor(endMinutes / 60);
        const finalMinutes = endMinutes % 60;
        endHours = endHours % 24;
        return `${endHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
    } catch (e) {
        console.error("Error calculating end time:", e);
        return '?';
    }
};
