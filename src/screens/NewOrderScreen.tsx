import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import database from '../database/database';

export default function NewOrderScreen({ route, navigation }: any) {
  
  // `encomenda` só vem preenchida quando a tela é aberta para edição
  const { cliente, encomenda } = route.params;
  const editando = !!encomenda;
  const [peca, setPeca]               = useState(encomenda?.peca ?? '');
  const [valor, setValor]             = useState(encomenda?.valor ?? '');
  const [prazo, setPrazo]             = useState(encomenda?.prazo ?? '');
  const [status, setStatus]           = useState(encomenda?.status ?? 'Em andamento');
  const [observacoes, setObservacoes] = useState(encomenda?.observacoes ?? '');
  
  // O título definido no App.tsx é fixo, então ajustamos aqui conforme o modo
  useEffect(() => {
    navigation.setOptions({ title: editando ? 'Editar Encomenda' : 'Nova Encomenda' });
  }, [editando, navigation]);

  function salvarEncomenda() {
    if (!peca.trim()) {
      Alert.alert('Atenção', 'Digite a peça');
      return;
    }
    
    try{
      if (editando) {
        database.runSync(
          `UPDATE encomendas SET peca = ?, valor = ?, prazo = ?, status = ?, observacoes = ? WHERE id = ?`,
          [peca, valor, prazo, status, observacoes, encomenda.id]
        );
      } else {
        database.runSync(
          `INSERT INTO encomendas (cliente_id, peca, valor, prazo, status, observacoes) VALUES (?, ?, ?, ?, ?, ?)`,
          [cliente.id, peca, valor, prazo, status, observacoes]
        );
      }

      Alert.alert('Sucesso', editando ? 'Encomenda Atualizada' : 'Encomenda salva');
      navigation.goBack();

    } catch (error) {

      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>{editando ? 'Editar Encomenda' : 'Nova Encomenda'}</Text>
      <Text style={styles.clientName}>{cliente.nome}</Text>

      <TextInput
        placeholder="Peça"
        style={styles.input}
        value={peca}
        onChangeText={setPeca}
      />

      <TextInput
        placeholder="Valor"
        style={styles.input}
        value={valor}
        onChangeText={setValor}
      />

      <TextInput
        placeholder="Prazo"
        style={styles.input}
        value={prazo}
        onChangeText={setPrazo}
      />

      <TextInput
        placeholder="Status"
        style={styles.input}
        value={status}
        onChangeText={setStatus}
      />

      <TextInput
        placeholder="Observações"
        style={styles.textArea}
        multiline
        numberOfLines={5}
        value={observacoes}
        onChangeText={setObservacoes}
      />

      <TouchableOpacity style={styles.button} onPress={salvarEncomenda}>

        <Text style={styles.buttonText}>{editando ? 'Salvar Alterações' : 'Salvar Encomenda'}</Text>

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
