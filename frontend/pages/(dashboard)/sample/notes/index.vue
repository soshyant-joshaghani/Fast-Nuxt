<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import { ApiError } from '~/lib/modules/global/utils/api-error';
import {
  createNote,
  deleteNote,
  listNotes,
  updateNote,
  type Note,
} from '~/lib/modules/apps/sample/api';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

const { token, isLoading, logout } = useAuth();

const notes = ref<Note[]>([]);
const title = ref('');
const content = ref('');
const error = ref('');
const loading = ref(false);
const saving = ref(false);
const selectedNote = ref<Note | null>(null);
const editTitle = ref('');
const editContent = ref('');
const sheetOpen = ref(false);

function handleUnauthorized() {
  logout();
  navigateTo('/login');
}

async function refresh() {
  if (!token.value) return;
  loading.value = true;
  error.value = '';
  try {
    notes.value = await listNotes(token.value);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      handleUnauthorized();
      return;
    }
    error.value = e instanceof Error ? e.message : 'Failed to load notes';
  } finally {
    loading.value = false;
  }
}

watch(
  [isLoading, token],
  () => {
    if (!isLoading.value && token.value) void refresh();
  },
  { immediate: true },
);

function openEdit(note: Note) {
  selectedNote.value = note;
  editTitle.value = note.title;
  editContent.value = note.content;
  error.value = '';
  sheetOpen.value = true;
}

function closeEdit() {
  selectedNote.value = null;
  editTitle.value = '';
  editContent.value = '';
  sheetOpen.value = false;
}

async function handleCreate() {
  if (!token.value || !title.value.trim()) return;
  saving.value = true;
  error.value = '';
  try {
    await createNote(token.value, { title: title.value.trim(), content: content.value.trim() || undefined });
    title.value = '';
    content.value = '';
    await refresh();
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      handleUnauthorized();
      return;
    }
    error.value = e instanceof Error ? e.message : 'Failed to create note';
  } finally {
    saving.value = false;
  }
}

async function handleSaveEdit() {
  if (!token.value || !selectedNote.value || !editTitle.value.trim()) return;
  saving.value = true;
  error.value = '';
  try {
    await updateNote(token.value, selectedNote.value.id, {
      title: editTitle.value.trim(),
      content: editContent.value.trim(),
    });
    closeEdit();
    await refresh();
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      handleUnauthorized();
      return;
    }
    error.value = e instanceof Error ? e.message : 'Failed to update note';
  } finally {
    saving.value = false;
  }
}

async function handleDelete(id: string) {
  if (!token.value) return;
  saving.value = true;
  error.value = '';
  try {
    await deleteNote(token.value, id);
    if (selectedNote.value?.id === id) closeEdit();
    await refresh();
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      handleUnauthorized();
      return;
    }
    error.value = e instanceof Error ? e.message : 'Failed to delete note';
  } finally {
    saving.value = false;
  }
}

const busy = computed(() => loading.value || saving.value);
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Sample Notes</h1>
      <p class="text-muted-foreground">Canonical CRUD module — Router → Service → Repository</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <Card class="lg:col-span-1">
        <CardHeader>
          <CardTitle>New note</CardTitle>
          <CardDescription>Create a note via POST /sample/notes</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="handleCreate">
            <div class="space-y-2">
              <Label for="title">Title</Label>
              <Input id="title" v-model="title" required />
            </div>
            <div class="space-y-2">
              <Label for="content">Content</Label>
              <Input id="content" v-model="content" />
            </div>
            <Button type="submit" :disabled="busy">Create note</Button>
          </form>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your notes</CardTitle>
          <CardDescription>{{ loading ? 'Loading…' : `${notes.length} note(s)` }}</CardDescription>
        </CardHeader>
        <CardContent>
          <p v-if="error" class="mb-4 text-sm text-destructive">{{ error }}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead class="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="notes.length === 0">
                <TableCell colspan="3" class="text-muted-foreground">No notes yet.</TableCell>
              </TableRow>
              <TableRow
                v-for="note in notes"
                :key="note.id"
                class="cursor-pointer"
                @click="openEdit(note)"
              >
                <TableCell class="font-medium">{{ note.title }}</TableCell>
                <TableCell class="text-muted-foreground">{{ note.content || '—' }}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    :disabled="busy"
                    aria-label="Delete note"
                    @click.stop="handleDelete(note.id)"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

    <Sheet v-model:open="sheetOpen" @update:open="(open) => !open && closeEdit()">
      <SheetContent side="right" class="sm:max-w-md">
        <form class="flex h-full flex-col" @submit.prevent="handleSaveEdit">
          <SheetHeader>
            <SheetTitle>Edit note</SheetTitle>
            <SheetDescription>Update the title and content, then save.</SheetDescription>
          </SheetHeader>
          <div class="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
            <div class="space-y-2">
              <Label for="edit-title">Title</Label>
              <Input id="edit-title" v-model="editTitle" required />
            </div>
            <div class="space-y-2">
              <Label for="edit-content">Content</Label>
              <Input id="edit-content" v-model="editContent" />
            </div>
          </div>
          <SheetFooter class="flex-row gap-2 sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              :disabled="busy || !selectedNote"
              @click="selectedNote && handleDelete(selectedNote.id)"
            >
              Delete
            </Button>
            <div class="flex gap-2">
              <Button type="button" variant="outline" :disabled="busy" @click="closeEdit">Cancel</Button>
              <Button type="submit" :disabled="busy">Save changes</Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  </div>
</template>
