import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function ProductionTableSkeleton() {
    return (
        <div className="rounded-md p-4">
            <div className="overflow-x-auto">
                <div className="flex justify-end py-2">
                    <Skeleton className="h-4 w-24" />
                </div>
                <Table className="w-full table-auto">
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: 7 }).map((_, index) => (
                                <TableHead key={index} className="px-2 py-3">
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: 7 }).map((_, colIndex) => (
                                    <TableCell key={colIndex} className="px-2 py-3">
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
