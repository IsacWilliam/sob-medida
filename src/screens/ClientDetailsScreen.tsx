import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ClientDetailsScreen({ route }: any) {

  const { cliente } = route.params;

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
});