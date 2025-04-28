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
import { Edit, Ellipsis } from "lucide-react";

export function ProductionTable({ entries }: { entries: any }) {
    const sortedEntries = [...(entries.data || [])].sort((a, b) => {
        if (a.lineNo < b.lineNo) return -1;
        if (a.lineNo > b.lineNo) return 1;
        return 0;
    });


    return (
        sortedEntries.length < 1 ? <div className="text-center text-gray-400 text-3xl w-full h-full">No Report exits</div> :
            <>
                <div>
                    <div className="flex justify-end py-2">
                        Date: {new Date().toLocaleDateString('en-GB')}
                    </div>
                    <Table className="border overflow-x-auto">
                        <TableCaption>Production Report Summary</TableCaption>
                        <TableHeader>
                            <TableRow className="h-14">
                                <TableHead className="border text-center">Line</TableHead>
                                <TableHead className="border text-center">P/Cod</TableHead>
                                <TableHead className="border text-center">Buyer</TableHead>
                                <TableHead className="border text-center">Style No</TableHead>
                                <TableHead className="border text-center">Order Qty</TableHead>
                                <TableHead className="border text-center">Item</TableHead>
                                <TableHead className="border text-center">Daily Target</TableHead>
                                <TableHead className="border text-wrap w-14 text-center">Daily Production</TableHead>
                                <TableHead className="border text-center">Unit Price</TableHead>
                                <TableHead className="border text-center">Total Price</TableHead>
                                <TableHead className="border text-center">%</TableHead>
                                <TableHead className="border text-center">Dollar</TableHead>
                                <TableHead className="border text-center">Total Amount</TableHead>
                                <TableHead className="border text-center">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedEntries.map((entry: any, index: number) => (
                                <TableRow className="" key={index}>
                                    <TableCell className="border text-center">{entry.lineNo}</TableCell>
                                    <TableCell className="border text-center">{entry.productionOrder.programCode}</TableCell>
                                    <TableCell className="border text-center">{entry.productionOrder.buyer}</TableCell>
                                    <TableCell className="border text-center text-nowrap">{entry.productionOrder.styleNo}</TableCell>
                                    <TableCell className="border text-center">{entry.productionOrder.orderQty}</TableCell>
                                    <TableCell className="border text-center">{entry.productionOrder.item}</TableCell>
                                    <TableCell className="border text-center">500</TableCell>
                                    <TableCell className="border text-center">{entry.dailyProduction}</TableCell>
                                    <TableCell className="border text-center">{Number(entry.productionOrder?.unitPrice).toFixed(2)}</TableCell>
                                    <TableCell className="border text-center">{entry.totalPrice.toFixed(2)}</TableCell>
                                    <TableCell className="border text-center">{entry.productionOrder?.percentage}%</TableCell>
                                    <TableCell className="border text-center">{entry.dollar.toFixed(2)}</TableCell>
                                    <TableCell className="border text-center">{entry.totalAmount.toFixed(0)}</TableCell>
                                    <TableCell className="border text-center">
                                        <Ellipsis />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="font-semibold">
                                <TableCell className="border text-center" colSpan={4}>
                                    Total
                                </TableCell>
                                <TableCell className="border text-center">{entries?.totals?.orderQty}</TableCell>
                                <TableCell className="border text-center"></TableCell>
                                <TableCell className="border text-center"> {/* Daily Target total, যদি থাকে */} </TableCell>
                                <TableCell className="border text-center">{entries?.totals?.dailyProduction}</TableCell>
                                <TableCell className="border text-center"></TableCell>
                                <TableCell className="border text-center">{entries?.totals?.totalPrice.toFixed(2)}</TableCell>
                                <TableCell className="border text-center"></TableCell>
                                <TableCell className="border text-center">{entries?.totals?.dollar.toFixed(2)}</TableCell>
                                <TableCell className="border text-center">{entries?.totals?.totalAmount.toFixed(0)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </>
    );
}
