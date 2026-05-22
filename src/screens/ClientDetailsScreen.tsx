import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, } from 'react-native';

import database from '../database/database';

interface Medidas {
  busto: string;
  cintura: string;
  quadril: string;
  ombro: string;
  comprimento: string;
}

interface Encomenda {
  id: number;
  peca: string;
  valor: string;
  prazo: string;
  status: string;
  observacoes: string;
}

export default function ClientDetailsScreen({
  route,
  navigation,
}: any) {

  const [medidas, setMedidas] = useState<Medidas | null>(null);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);

  const { cliente } = route.params;

  function carregarMedidas() {

    try {

      const resultado = database.getFirstSync(
        `
          SELECT *
          FROM medidas
          WHERE cliente_id = ?
          ORDER BY id DESC
          LIMIT 1
        `,
        [cliente.id]
      ) as Medidas | null;

      setMedidas(resultado);

    } catch (error) {
      console.log(error);
    }
  }

  function carregarEncomendas() {

  try {

    const resultado = database.getAllSync(
      `
        SELECT *
        FROM encomendas
        WHERE cliente_id = ?
        ORDER BY id DESC
      `,
      [cliente.id]
    ) as Encomenda[];

    setEncomendas(resultado);

    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    carregarMedidas();
    carregarEncomendas();
  }, []);

  function excluirCliente() {

    Alert.alert(
      'Excluir Cliente',
      'Deseja realmente excluir este cliente?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Excluir',

          onPress: () => {

            try {

              database.runSync(
                `
                  DELETE FROM medidas
                  WHERE cliente_id = ?
                `,
                [cliente.id]
              );

              database.runSync(
                `
                  DELETE FROM clientes
                  WHERE id = ?
                `,
                [cliente.id]
              );

              Alert.alert(
                'Sucesso',
                'Cliente excluído'
              );

              navigation.navigate('Clientes');

            } catch (error) {

              console.log(error);

              Alert.alert(
                'Erro',
                'Não foi possível excluir'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>
        {cliente.nome}
      </Text>

      <View style={styles.card}>

        <Text style={styles.label}>
          Telefone
        </Text>

        <Text style={styles.value}>
          {cliente.telefone || 'Não informado'}
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Email
        </Text>

        <Text style={styles.value}>
          {cliente.email || 'Não informado'}
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Observações
        </Text>

        <Text style={styles.value}>
          {cliente.observacoes || 'Sem observações'}
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Medidas
        </Text>

        {
          medidas ? (
            <>
              <Text style={styles.value}>
                Busto: {medidas.busto}
              </Text>

              <Text style={styles.value}>
                Cintura: {medidas.cintura}
              </Text>

              <Text style={styles.value}>
                Quadril: {medidas.quadril}
              </Text>

              <Text style={styles.value}>
                Ombro: {medidas.ombro}
              </Text>

              <Text style={styles.value}>
                Comprimento: {medidas.comprimento}
              </Text>
            </>
          ) : (
            <Text style={styles.value}>
              Nenhuma medida cadastrada
            </Text>
          )
        }

      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Encomendas
        </Text>

        {
          encomendas.length > 0 ? (
          
            encomendas.map((item) => (
            
              <View
                key={item.id}
                style={styles.orderCard}
              >
              
                <Text style={styles.orderTitle}>
                  {item.peca}
                </Text>
            
                <Text style={styles.value}>
                  Valor: {item.valor || 'Não informado'}
                </Text>
            
                <Text style={styles.value}>
                  Prazo: {item.prazo || 'Não informado'}
                </Text>
            
                <Text style={styles.value}>
                  Status: {item.status || 'Não informado'}
                </Text>
            
              </View>
            ))
          
          ) : (
          
            <Text style={styles.value}>
              Nenhuma encomenda cadastrada
            </Text>
          )
        }

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate(
            'EditarCliente',
            {
              cliente,
            }
          )
        }
      >
        <Text style={styles.buttonText}>
          Editar Cliente
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate(
            'Medidas',
            {
              cliente,
            }
          )
        }
      >
        <Text style={styles.buttonText}>
          Adicionar Medidas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate(
            'NovaEncomenda',
            {
              cliente,
            }
          )
        }
      >
        <Text style={styles.buttonText}>
          Nova Encomenda
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={excluirCliente}
      >
        <Text style={styles.buttonText}>
          Excluir Cliente
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#7A3E2B',
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7A3E2B',
    marginBottom: 8,
  },

  value: {
    fontSize: 17,
    color: '#444',
    marginBottom: 5,
  },

  button: {
    backgroundColor: '#7A3E2B',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: '#B00020',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  orderCard: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A3E2B',
    marginBottom: 8,
  },
});