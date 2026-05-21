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

export default function MeasurementsScreen({
  route,
}: any) {

  const { cliente } = route.params;

  const [busto, setBusto] = useState('');
  const [cintura, setCintura] = useState('');
  const [quadril, setQuadril] = useState('');
  const [ombro, setOmbro] = useState('');
  const [comprimento, setComprimento] =
    useState('');

  function salvarMedidas() {

    const todosVazios =
      !busto.trim() &&
      !cintura.trim() &&
      !quadril.trim() &&
      !ombro.trim() &&
      !comprimento.trim();

    if (todosVazios) {

      Alert.alert(
        'Atenção',
        'Preencha ao menos uma medida'
      );

      return;
    }

    try {

      database.runSync(
        `
          INSERT INTO medidas
          (
            cliente_id,
            busto,
            cintura,
            quadril,
            ombro,
            comprimento
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          cliente.id,
          busto,
          cintura,
          quadril,
          ombro,
          comprimento,
        ]
      );

      Alert.alert(
        'Sucesso',
        'Medidas salvas com sucesso'
      );

      setBusto('');
      setCintura('');
      setQuadril('');
      setOmbro('');
      setComprimento('');

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível salvar as medidas'
      );
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >

      <Text style={styles.title}>
        Medidas
      </Text>

      <Text style={styles.clientName}>
        {cliente.nome}
      </Text>

      <TextInput
        placeholder="Busto"
        style={styles.input}
        value={busto}
        onChangeText={setBusto}
      />

      <TextInput
        placeholder="Cintura"
        style={styles.input}
        value={cintura}
        onChangeText={setCintura}
      />

      <TextInput
        placeholder="Quadril"
        style={styles.input}
        value={quadril}
        onChangeText={setQuadril}
      />

      <TextInput
        placeholder="Ombro"
        style={styles.input}
        value={ombro}
        onChangeText={setOmbro}
      />

      <TextInput
        placeholder="Comprimento"
        style={styles.input}
        value={comprimento}
        onChangeText={setComprimento}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={salvarMedidas}
      >
        <Text style={styles.buttonText}>
          Salvar Medidas
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
    marginBottom: 10,
  },

  clientName: {
    fontSize: 18,
    marginBottom: 20,
    color: '#444',
  },

  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
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