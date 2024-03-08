export interface CalendarComponentProps {
    onDateChange: (date: Date) => void;
}
export type MoodDateType  = {
    diary:string;
    mood:string;
}
export interface MDEditorProps {
    url: string;
}
