import clsx from "clsx";
import dayjs from "dayjs";
import { Dimensions, TouchableOpacity,TouchableOpacityProps } from "react-native";
import { generateProgressPorcentage } from "../utils/generate-progress-porcentage";

const week_days = 7
const screen_horizontal_padding = (32*2)/5

export const day_Margin_between = 8
export const day_size =( Dimensions.get('screen').width / week_days ) - (screen_horizontal_padding + 5)

interface Iprops extends TouchableOpacityProps{
    date: Date;
    amountOfHabit?:number;
    amountCompled?:number;
}
export function HabitDay({ date, amountCompled = 0, amountOfHabit = 0, ...rest}:Iprops){
    const progressPercentage = amountOfHabit > 0 ? generateProgressPorcentage(amountOfHabit, amountCompled) : 0;
    const today = dayjs().startOf('day').toDate()
    const isCurrentDay = dayjs(date).isSame(today)
    return(
        <TouchableOpacity
            className={clsx(" rounded-lg border-2 m-1", {
                'bg-zinc-900  border-zinc-800': progressPercentage === 0,
                'bg-violet-900 border-violet-700': progressPercentage > 0 && progressPercentage < 20,
                'bg-violet-800 border-violet-600': progressPercentage >= 20 && progressPercentage < 40,
                'bg-violet-700 border-violet-500': progressPercentage >= 40 && progressPercentage < 60,
                'bg-violet-600 border-violet-500': progressPercentage >= 60 && progressPercentage < 80,
                'bg-violet-500 border-violet-400': progressPercentage >= 80,
                'border-white border-4': isCurrentDay
            })}
            style={{
                width:day_size,
                height:day_size
            }}
            activeOpacity={0.7}
            {...rest}
        />
    )
}