import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    id: string;
    name: string;
    className?: string;
}

export default function DatePickerInput({ value, onChange, id, name, className }: DatePickerProps) {
    const [date, setDate] = useState(value ? new Date(value) : null);

    const handleDateChange: (date: Date | null) => void = (date) => {
        setDate(date);
        onChange(date ? date.toISOString().split('T')[0] : '');
    };

    return (
        <DatePicker
            id={id}
            name={name}
            selected={date}
            onChange={handleDateChange}
            className={cn(
                'mt-0 border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                className
            )}
            dateFormat='yyyy-MM-dd'
            showPopperArrow={false}
            placeholderText='Select Date'
            wrapperClassName="w-full"
        />
    );
}