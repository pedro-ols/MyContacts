// app/index.js
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

import { IconButton, MD3Colors, Avatar } from "react-native-paper";

export default function HomeScreen() {
  const [contacts, setContacts] = useState([]); // Lista de contatos
  const [modalVisible, setModalVisible] = useState(false); // Modal visível ou não
  const [newContactName, setNewContactName] = useState(""); // Nome do novo contato
  const [newContactNum, setNewContactNum] = useState(""); // Número do novo contato
  const [editIndex, setEditIndex] = useState(null); // Índice do contato em edição

  // Função para adicionar ou editar contato
  function addOrEditContact() {
    if (!newContactName || !newContactNum) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (editIndex === null) {
      // Adiciona um novo contato
      setContacts([
        ...contacts,
        { name: newContactName, number: newContactNum },
      ]);
    } else {
      // Edita um contato existente
      const updatedContacts = [...contacts];
      updatedContacts[editIndex] = {
        name: newContactName,
        number: newContactNum,
      };
      setContacts(updatedContacts);
      setEditIndex(null);
    }

    setNewContactName(""); // Limpa o campo de texto
    setNewContactNum(""); // Limpa o campo de texto
    setModalVisible(false); // Fecha o modal
  }

  // Função para confirmar exclusão de contato
  function confirmDelete(index) {
    Alert.alert(
      "Excluir contato?",
      `Tem certeza que deseja remover "${contacts[index].name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const updatedContacts = contacts.filter((_, i) => i !== index);
            setContacts(updatedContacts);
          },
        },
      ]
    );
  }

  // Função para abrir o modal em modo de edição
  function openEditModal(index) {
    setNewContactName(contacts[index].name); // Carrega o nome do contato no campo de edição
    setNewContactNum(contacts[index].number); // Carrega o número do contato no campo de edição
    setEditIndex(index); // Define o índice do contato a ser editado
    setModalVisible(true); // Abre o modal
  }

  return (
    <View style={styles.container}>
      {/* Botão para abrir o modal */}
      <Pressable
        onPress={() => {
          setNewContactName("");
          setNewContactNum("");
          setEditIndex(null);
          setModalVisible(true);
        }}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>＋ Novo Contato</Text>
      </Pressable>

      {/* Lista de contatos */}
      <FlatList
        data={contacts}
        keyExtractor={(_, i) => String(i)} // Identificador único para cada item
        renderItem={({ item, index }) => (
          <View style={styles.contactItemContainer}>
            <Avatar.Text size={50} label={item.image || item.name.slice(0,1)} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactItem}>{item.name}</Text>
              <Text style={styles.contactItem}>
                {
                  item.number.length > 10
                    ? `(${item.number.slice(0, 2)}) ${item.number.slice(
                        2,
                        7
                      )}-${item.number.slice(7, 11)}`
                    : `Numerinho pequeno`

                }
                </Text>
            </View>
            <View style={styles.contactButtons}>
              {/* Botões para editar e excluir */}
              <Pressable
                onPress={() => openEditModal(index)} // Abre o modal para editar
                style={[styles.contactButton, styles.editButton]}
              >
                <Text style={styles.buttonText}>
                  <IconButton
                    icon="pencil"
                    iconColor={MD3Colors.error50}
                    size={20}
                  />
                </Text>
              </Pressable>
              <Pressable
                onPress={() => confirmDelete(index)} // Exclui o contato
                style={[styles.contactButton, styles.deleteButton]}
              >
                <Text style={styles.buttonText}>
                  <IconButton
                    icon="trash-can-outline"
                    iconColor={MD3Colors.error50}
                    size={20}
                  />
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum Contato ainda!</Text>
        }
      />

      {/* Modal para adicionar ou editar contato */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 8 }}>
              {editIndex === null
                ? "Digite seu novo contato:"
                : "Edite o contato:"}
            </Text>

            <TextInput
              value={newContactName} // O valor do campo de texto é controlado pelo estado `newContactName`
              onChangeText={setNewContactName} // Atualiza o estado com o novo texto
              placeholder="Nome (ex: João Silva)"
              style={styles.input}
            />
            <TextInput
              value={newContactNum} // O valor do campo de texto é controlado pelo estado `newContactNum`
              onChangeText={setNewContactNum} // Atualiza o estado com o novo texto
              placeholder="Número (ex: 99999999999)"
              keyboardType="numeric"
              style={styles.input}
            />
            <Pressable onPress={addOrEditContact} style={{ marginBottom: 8 }}>
              <Text style={{ color: "#6200ee", textAlign: "center" }}>
                {editIndex === null ? "Adicionar" : "Salvar alterações"}
              </Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#999", textAlign: "center" }}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#a4c9a3",
  },
  addButton: {
    marginBottom: 16,
    alignSelf: "center",
    backgroundColor: "#148e13",
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#dddddd",
    fontSize: 16,
  },
  contactItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#148e13",
    borderRadius: 6,
  },
  contactTextContainer: {
    flexDirection: "column",
  },
  contactItem: {
    flex: 1,
    flexDirection: "column",
    fontSize: 16,
    color: "#fff",
  },
  contactButtons: {
    flexDirection: "row",
  },
  contactButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: "#094008",
  },
  deleteButton: {
    backgroundColor: "#800000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#666",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
});
