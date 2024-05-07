import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function FullCalendarComponent({ tasks }) {
    console.log(tasks)
    const events = tasks?.map(task => ({
        title: task.title,
        start: task.createdAt, // Use createdAt as the event start date
        end: task.dueDate, // Use dueDate as the event end date
    }));

    return (        
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
        />
    );
}

export default FullCalendarComponent;
