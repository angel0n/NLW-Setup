import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { HabitDay, day_size } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generetaDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const week_days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generetaDatesFromYearBeginning()
const minimumSummaryDatesSizes = (18 * 5) + 1
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length
type Isummary = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>
export function Home() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<Isummary>([])

    const { navigate } = useNavigation()

    async function fetchData() {
        try {
            setLoading(true)
            const response = await api.get('/summary')
            setSummary(response.data)
        } catch (error) {
            Alert.alert('Ops', 'Não foi possível carregar o súmario de hábitos.')
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16" >
            <Header />
            <View className="flex-row mt-6 mb-2">
                {
                    week_days.map((week_day, index) => (
                        <Text
                            key={index}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: day_size }}
                        >
                            {week_day}
                        </Text>
                    ))
                }
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="flex-row flex-wrap">
                    {
                        datesFromYearStart.map((date, index) => {
                            const dayWithHabit = summary.find(day=>{
                                return dayjs(date).isSame(day.date, 'day')
                            })
                            return (
                                <HabitDay
                                    key={`${date.toString()}-${index}`}
                                    onPress={() => navigate("habit", { date: date.toISOString() })}
                                    date={date}
                                    amountCompled={dayWithHabit?.completed}
                                    amountOfHabit={dayWithHabit?.amount}
                                />
                            )
                        })
                    }
                    {
                        amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => {
                            return (
                                <View
                                    key={index}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{
                                        width: day_size,
                                        height: day_size
                                    }}
                                />
                            )
                        })
                    }
                </View>
            </ScrollView>
        </View>
    )
}