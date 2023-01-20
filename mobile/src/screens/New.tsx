import { View, ScrollView,Text } from "react-native";
import { BackButton } from "../components/BackButton";

export function New(){
    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator={false}>
                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>

                
                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento?
                </Text>
            </ScrollView>
        </View>
    )
}