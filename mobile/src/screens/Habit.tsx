import { useRoute } from "@react-navigation/native";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { generateProgressPorcentage } from "../utils/generate-progress-porcentage";

interface Params {
    date: string
}

interface IDayInfos {
    completedHabits: Array<string>;
    possibleHabits: Array<{
        id: string;
        title: string;
    }>
}
export function Habit() {
    const [loading, setLoading] = useState<boolean>(true)
    const [dayInfos, setDayInfos] = useState<IDayInfos>()
    const [completed, setCompleted] = useState<Array<string>>([])

    const route = useRoute()
    const { date } = route.params as Params;

    const parsedDate = dayjs(date)
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
    const dayOfWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')

    const habitsProgress = dayInfos?.possibleHabits.length ? generateProgressPorcentage(dayInfos.possibleHabits.length, completed.length) : 0

    async function fetchHabits() {
        try {
            setLoading(true)
            const response = await api.get('/day', { params: { date } })
            setDayInfos(response.data)
            setCompleted(response.data.completedHabits)
        } catch (error) {
            console.log(error);
            Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')

        } finally {
            setLoading(false)
        }
    }

    async function handleToggleHabit(habitId: string) {
        try{
            await api.patch(`/habits/${habitId}/toggle`)
            if (completed.includes(habitId)) {
                setCompleted(prevState => prevState.filter(habit => habit !== habitId))
            } else {
                setCompleted(prevState => [...prevState, habitId])
            }
        }catch(error){
            Alert.alert('Ops', 'Não foi possível atualizar o status do habito.')
            console.log(error);

        }
    }

    useEffect(() => {
        fetchHabits()
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitsProgress} />

                <View className={clsx("mt-6", { 'opacity-50': isDateInPast })}>
                    {
                        dayInfos?.possibleHabits && dayInfos.possibleHabits.length > 0 ?
                            dayInfos?.possibleHabits.map(dayInfo => {
                                return (
                                    <Checkbox
                                        onPress={() => handleToggleHabit(dayInfo.id)}
                                        disabled={isDateInPast}
                                        key={dayInfo.id}
                                        title={dayInfo.title}
                                        checked={completed.includes(dayInfo.id)}
                                    />
                                )
                            })
                            :
                            <HabitsEmpty />
                    }
                </View>
                {
                    isDateInPast && (
                        <Text className="text-white mt-10 text-center">
                            Você não pode editar hábitos de uma data passada.
                        </Text>
                    )
                }

            </ScrollView>
        </View>
    )
}