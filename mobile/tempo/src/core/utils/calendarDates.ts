export type CalendarDay = {
    date: Date;
    dateKey: string;
    dayNumber: number;
    isCurrentMonth: boolean;
};

export function getCalendarDays(visibleMonth: Date):
CalendarDay[] {
    const year = visibleMonth.getFullYear();
    const monthIndex = visibleMonth.getMonth();

    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const gridStartDate = new Date(year, monthIndex, 1);

    gridStartDate.setDate(
        firstDayOfMonth.getDate() - firstDayOfMonth.getDay(),
    )

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(
            gridStartDate.getFullYear(),
            gridStartDate.getMonth(),
            gridStartDate.getDate() + index,
        );

        return {
            date,
            dateKey: formatLocalDateKey(date),
            dayNumber: date.getDate(),
            isCurrentMonth: date.getMonth() === monthIndex && date.getFullYear() === year,
        };
    });
}

export function formatLocalDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function parseLocalDateKey(
    dateKey: string,
): Date {
    const [year, month, day]= dateKey
        .split("-")
        .map(Number);
    
    return new Date(
        year,
        month - 1,
        day,
    );
}