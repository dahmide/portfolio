import { format, type DateArg } from "date-fns";

export function formatDate(
    date: DateArg<Date> = new Date(),
    pattern: string = "yyyy"
): string {
    return format(date, pattern);
}
