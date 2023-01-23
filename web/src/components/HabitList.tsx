import * as CheckBox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface IHabitList {
    date: Date;
    onConpletedChange: (completed: number) => void
}

interface HabitInfo {
    possibleHabits: Array<{
        id: string;
        title: string;
        created_at: string;
    }>
    completedHabits: Array<string>
}
export function HabitList({ date, onConpletedChange }: IHabitList) {
    const [habitsInfo, setHabitsInfos] = useState<HabitInfo>()
    useEffect(() => {
        api.get('/day', {
            params: {
                date: date.toISOString()
            }
        }).then(response => {
            setHabitsInfos(response.data)
        })
    }, [])

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

    async function handleToggleHabit(habitId: string) {
        await api.patch(`/habits/${habitId}/toggle`)

        const isHabitAlreadyHabits = habitsInfo!.completedHabits.includes(habitId)
        let completedHabits: Array<string> = []
        if (isHabitAlreadyHabits) {
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
        } else {
            completedHabits = [...habitsInfo!.completedHabits, habitId]
        }

        setHabitsInfos({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits
        })
        onConpletedChange(completedHabits.length)
    }
    return (
        <div className='mt-6 flex flex-col gap-3'>
            {
                habitsInfo?.possibleHabits.map(habit => {
                    return (
                        <CheckBox.Root
                            key={habit.id}
                            className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                            checked={habitsInfo.completedHabits.includes(habit.id)}
                            disabled={isDateInPast}
                            onCheckedChange={() => handleToggleHabit(habit.id)}
                        >

                            <div
                                className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500  group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background'
                            >
                                <CheckBox.Indicator>
                                    <Check className='text-white' size={20} />
                                </CheckBox.Indicator>
                            </div>

                            <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                                {habit.title}
                            </span>
                        </CheckBox.Root>
                    )
                })
            }

        </div>
    )
}