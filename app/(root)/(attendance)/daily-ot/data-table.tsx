import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function DataTable({ overTime }: any) {
    // Sort the data by designation to group them
    const sortedOverTime = overTime.sort((a: any, b: any) => a.designation.localeCompare(b.designation));

    // Create a map to store row spans for each designation and the total OT for each designation
    let designationCount: { [key: string]: number } = {};
    let designationTotalOT: { [key: string]: number } = {};

    // First, calculate how many times each designation occurs and the total OT for each designation
    sortedOverTime.forEach((item: any) => {
        if (!designationCount[item.designation]) {
            designationCount[item.designation] = 0;
            designationTotalOT[item.designation] = 0;
        }
        designationCount[item.designation]++;
        designationTotalOT[item.designation] += item.TotalOT;
    });

    return (
        <Table className="border">
            <TableCaption>A list of today's OT details.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className='text-center border'>Designation</TableHead>
                    <TableHead className='text-center border'>Worker</TableHead>
                    <TableHead className='text-center border'>OT</TableHead>
                    <TableHead className='text-center border'>Total</TableHead>
                    <TableHead className='text-center border'>Total Over Time</TableHead>
                    <TableHead className='text-center border'>Attendance</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedOverTime.map((item: any, index: number) => {
                    // Determine if this is the first row for the current designation
                    const isFirstRow = index === 0 || sortedOverTime[index - 1].designation !== item.designation;

                    return (
                        <TableRow key={item.id}>
                            {isFirstRow && (
                                <TableCell className='text-center border font-medium ' rowSpan={designationCount[item.designation]}>
                                    {item.designation}
                                </TableCell>
                            )}
                            <TableCell className='text-center border'>{item.worker}</TableCell>
                            <TableCell className='text-center border'>{item.OT}</TableCell>
                            <TableCell className='text-center border'>{item.TotalOT}</TableCell>
                            {isFirstRow && (
                                <TableCell className='text-center border' rowSpan={designationCount[item.designation]}>
                                    {designationTotalOT[item.designation]}
                                </TableCell>
                            )}
                            {isFirstRow && (
                                <TableCell className='text-center border' rowSpan={designationCount[item.designation]}>
                                    {designationTotalOT[item.designation]}
                                </TableCell>
                            )}
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className='text-center border' colSpan={3}>Total OT Hours</TableCell>
                    <TableCell className='text-center border'>
                        {overTime.reduce((total: number, item: any) => total + item.TotalOT, 0)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
