import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import database from '../database/database';

interface Medidas {
  busto: string;
  cintura: string;
  quadril: string;
  ombro: string;
  comprimento: string;
}

export default function ClientDetailsScreen({ route, navigation }: any) {

  const [medidas, setMedidas] = useState<Medidas | null>(null);

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

  useEffect(() => { carregarMedidas() }, []);

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

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(
          'Medidas',
          {
            cliente,
          }
        )}>

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
          
        <Text style={styles.buttonText}>
          Adicionar Medidas
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
  },

  button: {
    backgroundColor: '#7A3E2B',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});