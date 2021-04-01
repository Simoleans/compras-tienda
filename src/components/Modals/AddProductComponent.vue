<template>
    <q-card class="bg-white text-black">
        <q-bar>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip content-class="bg-primary text-primary">Cerrar</q-tooltip>
            </q-btn>
        </q-bar>

        <q-card-section>
            <div class="text-h6">Crear Producto</div>
        </q-card-section>

        <q-card-section class="q-pa-md">
            <q-form
            class="q-pa-md"
            @submit="handleSave"
            >
                <q-input
                    filled
                    v-model="dataForm.name"
                    label="Nombre del producto"
                    lazy-rules
                    type="text"
                    required
                    >
                        <template v-slot:prepend>
                            <q-icon name="bookmark" />
                        </template>
                </q-input>
                <q-input
                    filled
                    v-model="dataForm.precio"
                    label="Precio en $"
                    lazy-rules
                    type="number"
                    step="0.01"
                    class="q-mt-md"
                    prefix="$"
                    >
                        <template v-slot:prepend>
                            <q-icon name="money" />
                        </template>
                </q-input>
                <q-input
                    filled
                    v-model="dataForm.stock"
                    label="Stock Inicial"
                    lazy-rules
                    type="number"
                    class="q-mt-md"
                    prefix="unidades / "
                    >
                        <template v-slot:prepend>
                            <q-icon name="add_box" />
                        </template>
                </q-input>
                <div class="q-mt-lg">
                    <q-btn label="Guardar" type="submit" color="primary"/>
                    <q-btn label="Limpiar" type="reset" color="primary" @click="resetForm" flat class="q-ml-sm" />
                </div>
            </q-form>
        </q-card-section>
    </q-card>
</template>

<script>
import { db } from 'boot/firebase';
import moment from 'moment';
export default {
    name: 'AddProductComponent',
    data () {
        return {
            dataForm : {
                precio : '',
                name : '',
                stock : '',
            },
            maximizedToggle: false,
        }
    },
    methods : {
        handleSave() {
                db.collection("productos").add({
                    ...this.dataForm
                })
                .then(() => {
                    this.$q.notify({
                        color: 'green-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: 'Productos Credo Correctamente - '+moment().format('DD-MM-YYYY, h:mm:ss a')
                    })
                    this.resetForm();
                    this.maximizedToggle = true;
                    this.$root.$emit('closeModal');
                    this.$root.$emit('saveProduct');
                    })
                .catch((error) => {
                    this.$q.notify({
                        color: 'red-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: error
                    })
                });
        },
        resetForm() {
            this.dataForm.precio = '';
            this.dataForm.stock = '';
            this.dataForm.producto = '';
        }
    }
}
</script>
