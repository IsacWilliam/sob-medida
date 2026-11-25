import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import database from '../database/database';

type Campo = 'busto' | 'cintura' | 'quadril' | 'ombro' | 'comprimento';

const CAMPOS: { chave: Campo; rotulo: string }[] = [
  { chave: 'busto', rotulo: 'Busto'},
  { chave: 'cintura', rotulo: 'Cintura'},
  { chave: 'quadril', rotulo: 'Quadril'},
  { chave: 'ombro', rotulo: 'Ombro'},
  { chave: 'comprimento', rotulo: 'Comprimento'},
];

const VAZIO: Record<Campo, string> = {
  busto: '',
  cintura: '',
  quadril: '',
  ombro: '',
  comprimento: ''
};

// 70.5 -> "70,5"
function numeroParaTexto(valor: number | null): string {
  return valor === null || valor === undefined ? '' : String(valor).replace('.', ',');
}

// "70,5" -> 70.5 | "" -> | inválido -> NaN
function textoParaNumero(texto: string): number | null {
  const limpo = texto.trim();
  if (limpo === '') return null;
  if (!/^\d+([.,]\d*)?$/.test(limpo)) return NaN; // só dígitos e um separador decimal
  return Number(limpo.replace(',', '.'));
}

// Remove o que não é número enquanto o usuário digita (vale também no web)
function limparNumero(texto: string): string {
  const semLixo = texto.replace(/[^0-9.,]/g, '').replace(/\./g, ',');
  const [inteiro, ...resto] = semLixo.split(',');
  return resto.length ? `${inteiro},${resto.join('')}` : inteiro;
}

export default function MeasurementsScreen({ route }: any) {
  const { cliente } = route.params;
 
  const [valores, setValores] = useState<Record<Campo, string>>(VAZIO);
 
  // Carrega as medidas já salvas deste cliente
  useEffect(() => {
    try {
      const salvo = database.getFirstSync<Record<Campo, number | null>>(
        `SELECT busto, cintura, quadril, ombro, comprimento FROM medidas WHERE cliente_id = ?`,
        [cliente.id]
      );
 
      if (salvo) {
        setValores({
          busto: numeroParaTexto(salvo.busto),
          cintura: numeroParaTexto(salvo.cintura),
          quadril: numeroParaTexto(salvo.quadril),
          ombro: numeroParaTexto(salvo.ombro),
          comprimento: numeroParaTexto(salvo.comprimento),
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar as medidas');
    }
  }, [cliente.id]);
 
  function atualizar(campo: Campo, texto: string) {
    setValores((atual) => ({ ...atual, [campo]: limparNumero(texto) }));
  }
 
  function salvarMedidas() {
    const numeros = {} as Record<Campo, number | null>;
 
    for (const { chave, rotulo } of CAMPOS) {
      const n = textoParaNumero(valores[chave]);
 
      if (n !== null && (Number.isNaN(n) || n <= 0)) {
        Alert.alert('Atenção', `Valor inválido em "${rotulo}". Use apenas números, ex: 70,5`);
        return;
      }
 
      numeros[chave] = n;
    }
 
    if (Object.values(numeros).every((n) => n === null)) {
      Alert.alert('Atenção', 'Preencha ao menos uma medida');
      return;
    }
 
    try {
      database.runSync(
        `INSERT INTO medidas (cliente_id, busto, cintura, quadril, ombro, comprimento, atualizado_em)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(cliente_id) DO UPDATE SET
           busto = excluded.busto,
           cintura = excluded.cintura,
           quadril = excluded.quadril,
           ombro = excluded.ombro,
           comprimento = excluded.comprimento,
           atualizado_em = excluded.atualizado_em`,
        [
          cliente.id,
          numeros.busto,
          numeros.cintura,
          numeros.quadril,
          numeros.ombro,
          numeros.comprimento,
        ]
      );
 
      Alert.alert('Sucesso', 'Medidas salvas com sucesso!');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar as medidas');
    }
  }
 
  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Medidas</Text>
      <Text style={styles.clientName}>{cliente.nome}</Text>
 
      {CAMPOS.map(({ chave, rotulo }) => (
        <TextInput
          key={chave}
          placeholder={`${rotulo} (cm)`}
          style={styles.input}
          value={valores[chave]}
          onChangeText={(texto) => atualizar(chave, texto)}
          keyboardType="decimal-pad"
        />
      ))}
 
      <TouchableOpacity style={styles.button} onPress={salvarMedidas}>
        <Text style={styles.buttonText}>Salvar Medidas</Text>
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
