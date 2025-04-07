// src/utils/dateUtils.js
export const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  export const getNext7Days = () => {
      const days = [];
      const today = new Date();
  
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
  
        const fullDate = formatDateToYYYYMMDD(date); // YYYY-MM-DD format
        const dayNumber = date.getDate().toString();
        const dayOfWeek = date.toLocaleDateString('en', { weekday: 'short' }); // Keep 'en' for consistency or use 'vi' if preferred
        const monthOfDay = date.toLocaleDateString('en', { month: 'short' }); // Keep 'en' for consistency
  
        days.push({ fullDate, dayNumber, dayOfWeek, monthOfDay });
      }
      return days;
  };
  
  export const getEndTime = (startTime, duration) => {
      if (!startTime || typeof duration !== 'number') return '';
      const [hours, minutes] = startTime.split(':').map(Number);
      const totalStartMinutes = hours * 60 + minutes;
      const totalEndMinutes = totalStartMinutes + duration;
  
      const endHours = Math.floor(totalEndMinutes / 60) % 24;
      const finalMinutes = totalEndMinutes % 60;
  
      return `${endHours.toString().padStart(2, '0')}:${finalMinutes
        .toString()
        .padStart(2, '0')}`;
  };
  
  export const formatPrice = (price) => {
    if (typeof price !== 'number') return '0';
    return price.toLocaleString('vi-VN'); // Use Vietnamese locale for currency
  };
  
  export const getAgeLimitColor = (ageLimit) => {
      switch (ageLimit) {
        case 'P': return 'bg-green-500'; // General Audiences
        case 'K': return 'bg-blue-500';   // Allowed for children under 13 with parental guidance (Vietnamese rating)
        case '13+': return 'bg-yellow-500 text-black'; // Viewers aged 13 and over
        case '16+': return 'bg-orange-500'; // Viewers aged 16 and over
        case '18+': return 'bg-red-600';    // Viewers aged 18 and over
        default: return 'bg-gray-500';      // No rating or unknown
      }
  };