import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import database from '../database/database';

export default function EditClientScreen({
  route,
  navigation,
}: any) {

  const { cliente } = route.params;

  const [nome, setNome] =
    useState(cliente.nome);

  const [telefone, setTelefone] =
    useState(cliente.telefone);

  const [email, setEmail] =
    useState(cliente.email);

  const [observacoes, setObservacoes] =
    useState(cliente.observacoes);

  function atualizarCliente() {

    if (!nome.trim()) {

      Alert.alert(
        'Atenção',
        'Digite o nome do cliente'
      );

      return;
    }

    try {

      database.runSync(
        `
          UPDATE clientes
          SET
            nome = ?,
            telefone = ?,
            email = ?,
            observacoes = ?
          WHERE id = ?
        `,
        [
          nome,
          telefone,
          email,
          observacoes,
          cliente.id,
        ]
      );

      Alert.alert(
        'Sucesso',
        'Cliente atualizado'
      );

      navigation.goBack();

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível atualizar'
      );
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >

      <Text style={styles.title}>
        Editar Cliente
      </Text>

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
        style={styles.textArea}
        multiline
        numberOfLines={5}
        value={observacoes}
        onChangeText={setObservacoes}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={atualizarCliente}
      >
        <Text style={styles.buttonText}>
          Salvar Alterações
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: '#F5EFE6',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7A3E2B',
    marginBottom: 20,
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