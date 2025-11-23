# 📦 CODE TEMPLATES & QUICK REFERENCE

Quick copy-paste templates for common patterns in GoolStar development.

---

## 🎨 COMPONENT TEMPLATES

### Server Component (Page)
```typescript
import { ComponentName } from "@/components/path/component-name";
import { getDataFunction } from "@/actions/actions-file";

export default async function PageName() {
  const data = await getDataFunction();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Page Title</h1>
          <p className="text-gray-600">Page description</p>
        </div>
        <Link href="/path/nuevo">
          <Button>Create New</Button>
        </Link>
      </div>

      <ComponentName data={data} />
    </div>
  );
}
```

### Client Component with Form
```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { schema, type SchemaType } from "@/lib/validations/schema";
import { serverAction } from "@/actions/actions-file";
import { toast } from "sonner";

interface ComponentProps {
  initialData?: Partial<SchemaType>;
}

export function ComponentName({ initialData }: ComponentProps) {
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      // defaults
    },
  });

  const onSubmit = async (data: SchemaType) => {
    try {
      await serverAction(data);
      toast.success("Success message");
      form.reset();
    } catch (error) {
      toast.error(error.message || "Error message");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

---

## 📝 FORM FIELD TEMPLATES

### Text Input
```typescript
<FormField
  control={form.control}
  name="field_name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input
          placeholder="Placeholder"
          {...field}
        />
      </FormControl>
      <FormDescription>Help text (optional)</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Textarea
```typescript
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Enter description..."
          rows={4}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Select Dropdown
```typescript
<FormField
  control={form.control}
  name="select_field"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select Label</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Date Picker
```typescript
<FormField
  control={form.control}
  name="fecha"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Fecha</FormLabel>
      <FormControl>
        <Input
          type="date"
          value={
            field.value instanceof Date
              ? field.value.toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => field.onChange(new Date(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Time Picker
```typescript
<FormField
  control={form.control}
  name="hora"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Hora</FormLabel>
      <FormControl>
        <Input
          type="time"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox
```typescript
<FormField
  control={form.control}
  name="is_active"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Active</FormLabel>
        <FormDescription>
          Check to mark as active
        </FormDescription>
      </div>
    </FormItem>
  )}
/>
```

### Number Input
```typescript
<FormField
  control={form.control}
  name="numero"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Número</FormLabel>
      <FormControl>
        <Input
          type="number"
          min={0}
          {...field}
          onChange={(e) => field.onChange(Number(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Currency Input
```typescript
<FormField
  control={form.control}
  name="monto"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Monto</FormLabel>
      <FormControl>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input
            type="number"
            step="0.01"
            min={0}
            className="pl-7"
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## 🗄️ SERVER ACTION TEMPLATES

### Basic CRUD Server Actions
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { schema } from "@/lib/validations/schema";

// CREATE
export async function createEntity(data: unknown) {
  const validated = schema.parse(data);
  const supabase = await createServerSupabaseClient();

  const { data: newEntity, error } = await supabase
    .from("table_name")
    .insert(validated)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/entities");
  return { id: newEntity.id };
}

// READ (List)
export async function getEntities(filters?: {
  field?: string;
}) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("table_name")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.field) {
    query = query.eq("field", filters.field);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data || [];
}

// READ (Single)
export async function getEntity(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("table_name")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// UPDATE
export async function updateEntity(id: string, data: unknown) {
  const validated = schema.parse(data);
  const supabase = await createServerSupabaseClient();

  const { data: updated, error } = await supabase
    .from("table_name")
    .update(validated)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/entities");
  revalidatePath(`/entities/${id}`);
  return updated;
}

// DELETE (Soft)
export async function deleteEntity(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("table_name")
    .update({ activo: false })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/entities");
  return { success: true };
}
```

### Server Action with Relations
```typescript
export async function getEntityWithRelations(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("table_name")
    .select(`
      *,
      related_table (
        id,
        nombre
      ),
      another_table (
        id,
        campo
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
```

---

## 📊 TABLE/LIST TEMPLATES

### Table Component
```typescript
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface Item {
  id: string;
  // other fields
}

interface ListProps {
  items: Item[];
}

export function EntityList({ items }: ListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay registros.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column 1</TableHead>
            <TableHead>Column 2</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.field1}</TableCell>
              <TableCell>{item.field2}</TableCell>
              <TableCell>
                <Badge variant="default">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/path/${item.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/path/${item.id}/editar`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Loading Skeleton
```typescript
import { Skeleton } from "@/components/ui/skeleton";

export function ListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
```

---

## 🎯 VALIDATION SCHEMAS

### Zod Schema Template
```typescript
import { z } from "zod";

export const entitySchema = z.object({
  // Required string
  nombre: z.string().min(1, "Campo requerido"),

  // Optional string
  descripcion: z.string().optional(),

  // Email
  email: z.string().email("Email inválido").optional(),

  // UUID
  related_id: z.string().uuid("ID inválido"),

  // Number with min/max
  numero: z.number().min(0).max(100),

  // Positive number
  precio: z.number().positive("Debe ser positivo"),

  // Date
  fecha: z.date(),

  // Optional date
  fecha_fin: z.date().optional(),

  // Boolean
  activo: z.boolean().default(true),

  // Enum
  tipo: z.enum(["tipo1", "tipo2", "tipo3"]),

  // Phone (Ecuador)
  telefono: z.string().regex(/^0\d{9}$/, "Teléfono inválido").optional(),

  // Cedula (Ecuador)
  cedula: z.string().regex(/^\d{10}$/, "Cédula inválida"),

  // Time (HH:MM)
  hora: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida"),
});

export type Entity = z.infer<typeof entitySchema>;
```

### Conditional Validation
```typescript
export const partidoSchema = z.object({
  torneo_id: z.string().uuid(),
  jornada_id: z.string().uuid().optional(),
  fase_eliminatoria_id: z.string().uuid().optional(),
}).refine(
  (data) => data.jornada_id || data.fase_eliminatoria_id,
  {
    message: "Debe tener jornada_id o fase_eliminatoria_id",
    path: ["jornada_id"],
  }
);
```

---

## 🎨 UI COMPONENTS

### Card with Header
```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Badge Variants
```typescript
import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Alert/Toast
```typescript
import { toast } from "sonner";

// Success
toast.success("Operación exitosa");

// Error
toast.error("Ocurrió un error");

// Info
toast.info("Información");

// Warning
toast.warning("Advertencia");

// Custom
toast("Custom message", {
  description: "Additional details",
  duration: 5000,
});
```

### Dialog
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

---

## 🔧 UTILITY FUNCTIONS

### Format Currency
```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
```

### Format Date
```typescript
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}
```

### Format Time
```typescript
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

### Format Player Name
```typescript
export function formatPlayerName(
  primerNombre: string,
  segundoNombre: string | null,
  primerApellido: string,
  segundoApellido: string | null
): string {
  const nombres = [primerNombre, segundoNombre].filter(Boolean).join(' ');
  const apellidos = [primerApellido, segundoApellido].filter(Boolean).join(' ');
  return `${nombres} ${apellidos}`;
}
```

---

## 🔍 SUPABASE QUERY PATTERNS

### Basic Query
```typescript
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("field", value);
```

### Query with Relations
```typescript
const { data, error } = await supabase
  .from("table_name")
  .select(`
    *,
    related_table (
      id,
      nombre
    )
  `)
  .eq("id", id)
  .single();
```

### Query with Filters
```typescript
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("field1", value1)
  .gte("field2", minValue)
  .lte("field3", maxValue)
  .order("created_at", { ascending: false })
  .limit(10);
```

### Count Query
```typescript
const { count, error } = await supabase
  .from("table_name")
  .select("*", { count: "exact", head: true })
  .eq("field", value);
```

### Insert
```typescript
const { data, error } = await supabase
  .from("table_name")
  .insert(dataObject)
  .select()
  .single();
```

### Update
```typescript
const { data, error } = await supabase
  .from("table_name")
  .update(updateObject)
  .eq("id", id)
  .select()
  .single();
```

### Delete
```typescript
const { error } = await supabase
  .from("table_name")
  .delete()
  .eq("id", id);
```

### RPC (Call Function)
```typescript
const { data, error } = await supabase
  .rpc("function_name", {
    param1: value1,
    param2: value2,
  });
```

---

## 🎨 TAILWIND COMMON CLASSES

### Layout
```css
/* Flex */
flex flex-col flex-row items-center justify-between gap-4

/* Grid */
grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4

/* Spacing */
space-y-6 space-x-4 p-4 px-6 py-4 m-4

/* Container */
container mx-auto max-w-7xl
```

### Typography
```css
/* Headings */
text-3xl font-bold
text-2xl font-semibold
text-lg font-medium

/* Body */
text-base text-gray-600
text-sm text-muted-foreground

/* Colors */
text-green-600 text-red-600 text-blue-600
```

### Responsive
```css
/* Mobile first */
w-full md:w-1/2 lg:w-1/3
hidden md:block
flex-col md:flex-row
```

---

## 📋 COMMON PATTERNS

### Conditional Rendering
```typescript
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
{items.length === 0 ? <EmptyState /> : <List items={items} />}
```

### Mapping Arrays
```typescript
{items.map((item) => (
  <Component key={item.id} data={item} />
))}
```

### Error Boundary
```typescript
try {
  await operation();
  toast.success("Success");
} catch (error) {
  console.error(error);
  toast.error(error instanceof Error ? error.message : "Error occurred");
}
```

---

**Use these templates to accelerate development!** 🚀
