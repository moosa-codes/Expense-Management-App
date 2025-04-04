import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Budget {
    id: string | number;
    name: string;
    amount: number;
    emoji: string;
    totalSpend: number;
    totalItems: number;
}

interface BarChartDashBoardProps {
    budgets: Budget[];
}

function BarChartDashBoard({ budgets }: BarChartDashBoardProps) {
    //   console.log(budgets);

    return (
        <div className='border rounded-lg p-5 bg-slate-50 mt-6 ml-6'>
            <h2 className='font-bold text-lg'>Progress</h2>
            <ResponsiveContainer width={'80%'} height={300}>

                <BarChart
                    width={500}
                    height={500}
                    data={budgets}
                    margin={{
                        top: 2,
                        bottom: 2,
                        left: 2,
                        right: 2,
                    }}
                >
                    <XAxis dataKey={'name'} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={'totalSpend'} stackId={'a'} fill='#4845d2' />
                    <Bar dataKey={'amount'} stackId={'a'} fill='#C3C2FF' />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}


export default BarChartDashBoard;
