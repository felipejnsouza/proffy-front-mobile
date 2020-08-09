import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import PageHeader from '../../components/PageHeader';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services/api';
import { Feather } from '@expo/vector-icons';
import  AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';


import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList(){
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isfiltersVisible, setIsFiltersVisible] = useState(false);

    const [subject, setSubject] = useState<React.ReactText>('');
    const [week_day, setWeek_day] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersId = favoritedTeachers.map((teacher: Teacher) => teacher.id)
                
                setFavorites(favoritedTeachersId);
            }
        })
    }
    

    function handleToggleFiltersVisible(){
        setIsFiltersVisible(!isfiltersVisible);
    }

    async function handleFiltersSubmit(){
        loadFavorites();
        
        const response = await api.get('classes', {
            params: {
                subject: subject.toString(),
                week_day,
                time,
            }
        })
        console.log({
            subject: subject.toString,
            week_day,
            time,
        })
        setIsFiltersVisible(false);
        setTeachers(response.data);
    }

    return (
    <View style={styles.container}>
        <PageHeader 
            title="Poffys disponíveis" 
            headerRight={(
                <BorderlessButton onPress={handleToggleFiltersVisible}>
                    <Feather name="filter" size={20} color="#FFF"></Feather>
                </BorderlessButton>
            )}>
            
            { isfiltersVisible && (
                
                <View style={styles.searchForm}>
                    <Text style={styles.label}>Matéria</Text>
                    <Picker
                        style={styles.input}
                        selectedValue={subject}
                        onValueChange={(itemValue) => setSubject(itemValue)}  
                    >
                        <Picker.Item label="Qual a matéria?" value=""/>
                        <Picker.Item label="Artes" value="Artes"/>
                        <Picker.Item label="Biologia" value="Biologia"/>
                        <Picker.Item label="Ciências" value="Ciências"/>
                        <Picker.Item label="Educação Física" value="Educação Física"/>
                        <Picker.Item label="Geografia" value="Geografia"/>
                        <Picker.Item label="História" value="História"/>
                        <Picker.Item label="Matemática" value="Matemática"/>
                        <Picker.Item label="Português" value="Português"/>
                        <Picker.Item label="Química" value="Química"/>
                        <Picker.Item label="Física" value="Física"/>
                    </Picker>

                    <View style={ styles.inputGroup}>
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Dia da semana</Text>
                            <TextInput
                                style={styles.input}
                                value={week_day}
                                onChangeText={text => setWeek_day(text)}
                                placeholder="Qual o dia?"    
                                placeholderTextColor="#c1bccc"
                            />

                        </View>

                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Horário</Text>
                            <TextInput
                                style={styles.input}
                                value={time}
                                onChangeText={text => setTime(text)}
                                placeholder="Qual horário?"  
                                placeholderTextColor="#c1bccc"  
                            />

                        </View>
                    </View>
                    <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Filtrar</Text>

                    </RectButton>

                </View>
            )}
        </PageHeader>

        <ScrollView
            style={styles.teacherList}
            contentContainerStyle={{
                paddingHorizontal:16,
                paddingBottom: 20,
            }}
        >
            {teachers.map( (teacher: Teacher) => {
                return <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                            />
            })}

        </ScrollView>

    </View>
    
    )
};

export default TeacherList;