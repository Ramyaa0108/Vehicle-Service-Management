export const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hour, min] = timeString.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${min} ${ampm}`;
};
