import { useNavigation } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import { HabitDay, day_size } from "../components/HabitDay";
import { Header } from "../components/Header";
import { generetaDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const week_days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generetaDatesFromYearBeginning()
const minimumSummaryDatesSizes = (18 * 5) + 1
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length
export function Home() {
    const { navigate } = useNavigation()
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
                        datesFromYearStart.map((date, index) => (
                            <HabitDay
                                key={`${date.toString()}-${index}`}
                                onPress={() => navigate("habit",{date:date.toISOString()})}

                            />
                        ))
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