import { useCallback, useState } from "react";
import { Alert, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { formatPhoneNumber } from '../utils/phoneMask';
import database from "../database/database";

interface Cliente {
    id: number;
    nome: string;
    telefone: string | null;
    email: string | null;
    observacoes: string | null;
}

export default function ClientsScreen({ navigation }: any) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  const carregarClientes = useCallback(() => {
    try {
      const resultado = database.getAllSync(`SELECT * FROM clientes ORDER BY id DESC`) as Cliente[];
      
      setClientes(resultado);
    
    } catch(error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de clientes.');
    }
  }, []);
  
  useFocusEffect( useCallback(() => { carregarClientes() }, [carregarClientes]));
  
  return (
  
  <View style={styles.container}>
    
    <Text style={styles.title}>Clientes</Text>

    <TouchableOpacity
      style={styles.refreshButton}
      onPress={carregarClientes} >

      <Text style={styles.refreshText}>Atualizar Lista</Text>
    </TouchableOpacity>

    <FlatList
      data={clientes}
      keyExtractor={ (item) => item.id.toString() }
      renderItem={ ({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('DetalhesCliente', { cliente: item })} >

          <Text style={styles.nome}>{ item.nome }</Text>
          
          <Text style={styles.info}>{ formatPhoneNumber(item.telefone ?? '') }</Text>
          
          <Text style={styles.info}>{ item.email }</Text>
        </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5EFE6',
      padding: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#7A3E2B',
    },

    refreshButton: {
      backgroundColor: '#7A3E2B',
      padding: 14,
      borderRadius: 10,
      marginBottom: 20,
      alignItems: 'center',
    },

    refreshText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },

    card: {
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
    },

    nome: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#7A3E2B',
      marginBottom: 8,
    },

    info: {
      fontSize: 16,
      color: '#444',
    },
});
