import { useState } from "react";

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

import database from "../database/database";

export default function NewClientScreen() {
    const [nome       , setNome]        = useState("");
    const [telefone   , setTelefone]    = useState("");
    const [email      , setEmail]       = useState("");
    const [observacoes, setObservacoes] = useState("");

    function salvarCliente() {
        if(!nome.trim()) {
            Alert.alert("Atenção", "Digite o nome do cliente.");
            return;
        }

        try{
            database.runSync(
                `
                    INSERT INTO clientes
                    (nome, telefone, email,observacoes)
                    VALUES (?, ?, ?)
                `,
                [nome, telefone, email, observacoes]
            );

            Alert.alert("Sucesso", "Dados do cliente salvo com sucesso.");

            setNome("");
            setTelefone("");
            setEmail("");
            setObservacoes("");
        }catch(error) {
            console.log(error);

            Alert.alert("Erro", "Não foi possível salvar os dados do cliente.");
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            
            <Text style={styles.title}>Novo Cliente</Text>
            
            <TextInput 
                placeholder="Nome"
                style={styles.input}
                value={nome}
                onChangeText={setNome}
            />
            
            <TextInput
                placeholder="Telefone"
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
            />

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Observações"
                style={styles.input}
                value={observacoes}
                onChangeText={setObservacoes}
            />

            <TouchableOpacity style={styles.button} onPress={salvarCliente}>
                <Text style={styles.buttonText}>
                    Salvar Cliente
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F5EFE6',
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#7A3E2B',
    },

    input: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },

    textArea: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
        height: 120,
        textAlignVertical: 'top',
    },

    button: {
        backgroundColor: '#7A3E2B',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});