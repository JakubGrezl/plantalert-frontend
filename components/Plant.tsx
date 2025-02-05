import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import ProgressBar from "@/components/ProgressBar"
import {getColors} from "@/constants/Colors";
import textStyles from "@/constants/TextStyles"
import InfoCard from "@/components/InfoCard";
import Chart from "@/components/Chart";
import {getChartData} from "@/hooks/getChartData";
import {IconSymbol} from "@/components/ui/IconSymbol";
import {fetchLastSensor} from "@/hooks/sensor";
import {translateToPercentage} from "@/utils/translator"
import {Sensor_Response} from "@/hooks/sensor";
import {useTheme, themesTypes} from "./ThemeProvider"

let colors = getColors();

export default function PlantCard(props: {name: string, age: string, image?: string, mac: string}) {
    const {name, age, image, mac} = props;
    const [isModalVisible, setModalVisible] = useState(false);
    const [sensor, setSensor] = useState<Sensor_Response>();
    let {theme} = useTheme();
    let styles = returnStyles(theme)

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    let chart = getChartData("demo")

    useEffect(() => {
        // Function to fetch the latest sensor data
        const fetchData = async () => {
            try {
                const sensorData = await fetchLastSensor(mac);
                if (sensorData) {
                    setSensor(sensorData);
                }
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        };

        // Initial fetch
        fetchData();

        // Set up periodic fetching
        const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds

        // Cleanup function to clear the interval
        return () => clearInterval(intervalId);
    }, [mac]); // Re-run if `mac` changes


    return (
        <>
            <TouchableOpacity
                onPress={toggleModal}
                style={styles.card}
            >
                <View style={styles.wrapper}>
                    <Image
                        style={styles.image}
                        source={image ?? require("@/assets/images/chinese-money-plant.png")}
                        alt="Plant Icon"
                    />
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>{name}</Text>
                        <Text style={{ fontSize: 17, fontWeight: '500', color: theme.subtitle, fontStyle: 'italic'}}>Zasazeno: {age}</Text>
                    </View>
                </View>
                <ProgressBar color={"white"} progress={translateToPercentage(Number(sensor?.soil))} max={100} />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={toggleModal}>
                        <View style={styles.modalBackground} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <ScrollView style={{maxHeight: "100%", maxWidth: "100%"}}>
                            <View style={{gap: 10}}>
                                <View style={styles.infoCardContainer}>
                                    <InfoCard cardTitle="Air-Humadity" iconName="drop" value={`${sensor?.humidity} %`} iconColor="green"/>
                                    <InfoCard cardTitle="Soil-Humadity" iconName="drop" value={`${translateToPercentage(Number(sensor?.soil))} %`} iconColor="green"/>
                                    <InfoCard cardTitle="Air-Tempature" iconName="thermometer" iconColor="green" value={`${sensor?.temp} °C`}/>
                                    <InfoCard cardTitle="Light" iconName="lightbulb" iconColor="green" value={`${sensor?.light} lux`}/>
                                </View>
                                {/*<Text style={textStyles.title}>Advanced information</Text>*/}
                                {/*<View style={styles.row}>*/}
                                {/*    <IconSymbol name="drop" size={20} color={colors.icon}></IconSymbol>*/}
                                {/*    <Text style={textStyles.subtitle}> Humadity over time</Text>*/}
                                {/*</View>*/}
                                {/*    {chart && (*/}
                                {/*        <Chart key="chart" lines={chart} />*/}
                                {/*    )}*/}
                                {/*<View style={styles.row}>*/}
                                {/*    <IconSymbol name="thermometer" size={20} color={colors.icon}></IconSymbol>*/}
                                {/*    <Text style={textStyles.subtitle}> Air tempature over time</Text>*/}
                                {/*</View>*/}
                                {/*{chart && (*/}
                                {/*    <Chart key="chart" lines={chart} />*/}
                                {/*)}*/}

                                {/*<View style={styles.row}>*/}
                                {/*    <IconSymbol name="drop" size={20} color={colors.icon}></IconSymbol>*/}
                                {/*    <Text style={textStyles.subtitle}> Air humadity over time</Text>*/}
                                {/*</View>*/}
                                {/*{chart && (*/}
                                {/*    <Chart key="chart" lines={chart} />*/}
                                {/*)}*/}
                                {/*<View style={styles.row}>*/}
                                {/*    <IconSymbol name="lightbulb" size={20} color={colors.icon} />*/}
                                {/*    <Text style={textStyles.subtitle}> Light over time</Text>*/}
                                {/*</View>*/}
                                {/*{chart && (*/}
                                {/*    <Chart key="chart" lines={chart} />*/}
                                {/*)}*/}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

function returnStyles(theme: themesTypes) {
    return StyleSheet.create({
        wrapper: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        card: {
            flexDirection: 'column',
            padding: 10,
            borderRadius: 12,
            backgroundColor: theme.background,
            borderWidth: 2,
            borderColor: theme.border,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 5,
        },
        image: {
            width: 80, // Fixed width for the image
            height: 80, // Fixed height for the image
            resizeMode: 'contain', // Properly scale the image
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',

        },
        modalBackground: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        },
        modalContent: {
            maxHeight: "70%",
            backgroundColor: theme.background,
            borderRadius: 12,
            padding: 20,
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 10,
        },
        infoCardContainer: {
            minWidth: "90%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
        },
        chartsContainer: {
            flexShrink: 1,
            flex: 1,
            width: "100%",
        },
        infoCardRow: {
            flexDirection: 'row',
            // flex: 1,
            width: '100%',
            justifyContent: 'space-between',
        },
        row: {
            display: "flex",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

}

