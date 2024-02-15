<template>
  <v-container fluid>
    <!-- board column -->
    <v-row style="min-width: 800px" class="horizontally-scrollable">
      <v-col
        v-for="(column, colIndex) in columns"
        :key="column.key"
        cols="3"
        class="pa-4 flex-fill"
      >
        <div class="d-flex align-center">
          <h5 class="font-weight-bold">
            {{ column.key }}
          </h5>
          <v-spacer></v-spacer>
          <!-- add new card button -->
          <v-btn
            variant="text"
            rounded
            icon="mdi-plus"
            size="small"
            color="primary"
            class="mr-n3"
            @click="column.isAddVisible = !column.isAddVisible"
          >
          </v-btn>
        </div>

        <!-- add new card form -->
        <v-card v-show="column.isAddVisible" class="pa-4 my-2">
          <v-select
            v-model="column.addTitle"
            label="Select"
            autofocus
            variant="underlined"
            :items="dishes"
            item-title="name"
            @keyup.enter="addCard(column)"
            @keyup.esc="column.isAddVisible = false"
          >
          </v-select>

          <div class="mt-3 d-flex flex-md-row flex-column">
            <v-btn
              class="flex-fill ma-1"
              size="small"
              @click="column.isAddVisible = !column.isAddVisible"
              >Cancel</v-btn
            >
            <v-btn class="flex-fill ma-1" size="small" color="primary" @click="addCard(column)"
              >Add</v-btn
            >
          </div>
        </v-card>

        <!-- draggable cards -->
        <vue-draggable
          v-model="column.cards"
          v-bind="{
            animation: 200,
            group: 'dish',
            disabled: false,
            ghostClass: 'ghost',
          }"
          class="list-group"
          item-key="id"
          @change="column.callback"
        >
          <template #item="{ element, index }">
            <calendar-card
              :key="index"
              :card="element"
              class="board-item my-2 pa-2"
              @edit="showEdit(element)"
              @delete="showDelete(element, colIndex)"
            />
          </template>
        </vue-draggable>
      </v-col>
    </v-row>
  </v-container>

  <!-- edit card dialog -->
  <v-dialog v-model="editDialog" persistent width="600">
    <v-card>
      <v-card-title class="pa-4 d-flex align-center">
        <span class="flex-fill">Customize | work in progress, don't do anything here</span>
        <v-btn
          variant="text"
          rounded
          icon="mdi-close"
          size="small"
          color="primary"
          class="mr-n3"
          @click="editDialog = false"
        >
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <div class="pa-4">
        <v-text-field
          v-model="title"
          class="py-2 px-1"
          color="primary"
          label="Title"
          variant="plain"
          hide-details
          placeholder="Title"
          autofocus
          @keyup.enter="saveCard"
        ></v-text-field>
        <v-divider></v-divider>
        <v-textarea
          v-model="description"
          class="px-2 py-1"
          variant="plain"
          placeholder="Description"
          hide-details
        ></v-textarea>
      </div>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-btn variant="outlined" @click="editDialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="saveCard">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- delete card dialog -->
  <v-dialog v-model="deleteDialog" max-width="300">
    <v-card>
      <v-card-title class="text-headline">Delete</v-card-title>
      <v-card-text>DeleteDescription</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="plain" color="primary" @click="deleteDialog = false">Cancel</v-btn>
        <v-btn variant="flat" color="error" @click="deleteCard()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, reactive, watch, toRaw, onActivated, onDeactivated, onBeforeMount } from 'vue'
import VueDraggable from 'vuedraggable'
import CalendarCard from '@components/CalendarCard.vue'
import { useAppStore } from '@store/app'
import { useCalendarStore } from '@store/calendar'
import { useDishStore } from '@store/dish'
import { storeToRefs } from 'pinia'

onActivated(() => {
  if (!columns.length) {
    initColumns()
    parseCards()
  }
})

onDeactivated(() => {})

onBeforeMount(async () => {
  await calendarStore.setup()
})

const calendarStore = useCalendarStore()
const appStore = useAppStore()
const dishStore = useDishStore()

const { addWeek } = calendarStore
const { loading } = storeToRefs(appStore)
const { dishes } = storeToRefs(dishStore)
const { currentWeek, currentWeekId } = storeToRefs(calendarStore)

const days = ref(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
const columns = reactive([])

watch(
  loading,
  async () => {
    parseCards(currentWeek.value.cards)
  },
  { deep: true },
)

// TODO: find a better way to update cards when first adding a new one
watch(
  currentWeekId,
  async () => {
    parseCards(currentWeek.value.cards)
  },
  { deep: true },
)

const initColumns = () => {
  days.value.forEach((day, index) => {
    columns.push({
      key: day,
      cards: [],
      isAddVisible: false,
      callback: (e) => changeDay(e, index),
    })
  })
}

const parseCards = async (cards = []) => {
  if (!cards) return columns.map((column) => (column.cards = []))

  columns.forEach((column) => {
    column.cards = cards
      .filter((card) => card.day === column.key)
      .sort((a, b) => (a.order < b.order ? -1 : 0))
  })
}

const addCard = (column) => {
  const { addTitle, key } = column
  const dish = dishes.value.find(({ name }) => name == addTitle)
  if (!addTitle) return
  const newCard = {
    id: dish.id,
    day: key,
    name: addTitle,
    photo: dish.photo,
    order: -1,
  }
  column.cards.unshift(newCard)
  column.addTitle = ''
  column.isAddVisible = false
}

const changeDay = (e, colIndex) => {
  if (e.added || e.moved) {
    const column = columns[colIndex]
    const day = column.key
    for (let i = 0; i < column.cards.length; i++) {
      column.cards[i].order = i
      column.cards[i].day = day
    }
  }
}

// Edit
const cardToEdit = ref(null)
const title = ref('')
const description = ref('')
const editDialog = ref(false)
const showEdit = (card) => {
  cardToEdit.value = card
  title.value = card.title
  description.value = card.description
  editDialog.value = true
}

const saveCard = () => {
  const targetCard = currentWeek.value.cards.value.find((card) => card.id === cardToEdit.value.id)
  if (targetCard) {
    targetCard.title = title.value
    targetCard.description = description.value
    editDialog.value = false
  }
}

// Delete
const deleteDialog = ref(false)
const cardToDelete = ref(null)
const colIndexFromDelete = ref(null)
const showDelete = (card, columnIndex) => {
  cardToDelete.value = card
  colIndexFromDelete.value = columnIndex
  deleteDialog.value = true
}

const deleteCard = () => {
  deleteDialog.value = false
  const cardIndex = columns[colIndexFromDelete.value].cards.findIndex(
    (card) => card.id === cardToDelete.value.id,
  )

  if (cardIndex !== -1) {
    columns[colIndexFromDelete.value].cards.splice(cardIndex, 1)
  }
}

watch(
  columns,
  async (newColumns) => {
    const columnsCardData = newColumns.reduce(
      (acc, { cards = [] }) => [...toRaw(cards), ...acc],
      [],
    )
    if (newColumns.length && columnsCardData.length) {
      await addWeek(columnsCardData)
    }
  },
  { deep: true },
)
</script>

<style scoped>
.horizontally-scrollable {
  overflow-x: scroll;
  flex-wrap: nowrap;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.board-item {
  transition: transform 0.2s;
  &:hover {
    transition: transform 0.2s;
    transform: translateY(-3px);
  }
}
.list-group {
  min-height: 100%;
}
</style>
