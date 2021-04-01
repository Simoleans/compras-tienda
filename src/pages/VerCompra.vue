<template>
    
  <div id="invoice">

    <div class="toolbar hidden-print">
      <div class="text-right">
            <!-- <button id="printInvoice" class="btn btn-info"><i class="fa fa-print"></i> Print</button>
            <button class="btn btn-info"><i class="fa fa-file-pdf-o"></i> Export as PDF</button> -->
            <q-btn  to="/compras" flat color="primary" icon="arrow_back" label="Volver">
              <q-tooltip content-class="bg-blue text-black shadow-4" :offset="[10, 10]">
                Volver
              </q-tooltip>
            </q-btn>
            
        </div>
        <hr>
    </div>
    <div class="invoice overflow-auto">
        <div style="min-width: 600px">
            <header>
                <div class="row">
                    <div class="col">
                        <a target="_blank" href="https://lobianijs.com">
                            <img src="~assets/logo.jpg" width="120">
                            </a>
                    </div>
                    <!-- <div class="col company-details">
                        <div>455 Foggy Heights, AZ 85004, US</div>
                        <div>(123) 456-789</div>
                        <div>company@example.com</div>
                    </div> -->
                </div>
            </header>
            <main>
                <table border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th class="text-left">PRODUCTO</th>
                            <th class="text-right">CANTIDAD</th>
                            <th class="text-right">PRECIO UNITARIO $</th>
                            <!-- <th class="text-right">PRECIO BS</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,k) in items" :key="k">
                            <td class="no">{{ k + 1}}</td>
                            <td class="text-left">{{ item.product }}</td>
                            <td class="unit">{{ item.cant }}</td>
                            <td class="qty">{{ item.price_unit }}</td>
                            <!-- <td class="total">{{ item.price_unit * item.cant }}$</td> -->
                        </tr>
                    </tbody>
                    <tfoot>
                        <!-- <tr>
                            <td colspan="2"></td>
                            <td colspan="2">TAX 25%</td>
                            <td>$1,300.00</td>
                        </tr> -->
                        <tr>
                            <td colspan="1"></td>
                            <td colspan="2">TOTAL $</td>
                            <td>{{ compra.total }}$</td>
                        </tr>
                        <tr>
                            <td colspan="1"></td>
                            <td colspan="2">TOTAL BS</td>
                            <td>{{ compra.total_bs }}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="notices">
                    <div>DESCRIPCIÓN:</div>
                    <div class="notice">{{ compra.descripcion }}</div>
                </div>
            </main>
            <footer>
              MINIMARKET 1923 C.A
            </footer>
        </div>
        <div></div>
    </div>
</div>
</template>

<style scoped>
  #invoice{
      padding: 30px;
  }

  .invoice {
      position: relative;
      background-color: #FFF;
      min-height: 680px;
      padding: 15px;
      width : 100%;
  }

  .invoice header {
      padding: 10px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #3989c6
  }

  .invoice .company-details {
      text-align: right
  }

  .invoice .company-details .name {
      margin-top: 0;
      margin-bottom: 0
  }

  .invoice .contacts {
      margin-bottom: 20px
  }

  .invoice .invoice-to {
      text-align: left
  }

  .invoice .invoice-to .to {
      margin-top: 0;
      margin-bottom: 0
  }

  .invoice .invoice-details {
      text-align: right
  }

  .invoice .invoice-details .invoice-id {
      margin-top: 0;
      color: #3989c6
  }

  .invoice main {
      padding-bottom: 50px;
      /* width : 100%; */
  }

  .invoice main .thanks {
      margin-top: -100px;
      font-size: 2em;
      margin-bottom: 50px
  }

  .invoice main .notices {
      padding-left: 6px;
      border-left: 6px solid #3989c6
  }

  .invoice main .notices .notice {
      font-size: 1.2em
  }

  .invoice table {
      /* width: 100%; */
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 20px
  }

  .invoice table td,.invoice table th {
      padding: 15px;
      background: #eee;
      border-bottom: 1px solid #fff
  }

  .invoice table th {
      white-space: nowrap;
      font-weight: 400;
      font-size: 16px
  }

  .invoice table td h3 {
      margin: 0;
      font-weight: 400;
      color: #3989c6;
      font-size: 1.2em
  }

  .invoice table .qty,.invoice table .total,.invoice table .unit {
      text-align: right;
      font-size: 1.2em
  }

  .invoice table .no {
      color: #fff;
      font-size: 1.6em;
      background: #3989c6
  }

  .invoice table .unit {
      background: #ddd
  }

  .invoice table .total {
      background: #3989c6;
      color: #fff
  }

  .invoice table tbody tr:last-child td {
      border: none
  }

  .invoice table tfoot td {
      background: 0 0;
      border-bottom: none;
      white-space: nowrap;
      text-align: right;
      padding: 10px 20px;
      font-size: 1.2em;
      border-top: 1px solid #aaa;
      width: 100%;
  }

  .invoice table tfoot tr:first-child td {
      border-top: none
  }

  .invoice table tfoot tr:last-child td {
      color: #3989c6;
      font-size: 1.4em;
      border-top: 1px solid #3989c6
  }

  .invoice table tfoot tr td:first-child {
      border: none
  }

  .invoice footer {
      width: 100%;
      text-align: center;
      color: #777;
      border-top: 1px solid #aaa;
      padding: 8px 0
  }

  @media print {
      .invoice {
          font-size: 11px!important;
          overflow: hidden!important
      }

      .invoice footer {
          position: absolute;
          bottom: 10px;
          page-break-after: always
      }

      .invoice>div:last-child {
          page-break-before: always
      }
  }
</style>

<script>
import { db } from 'boot/firebase';
export default {
  name: 'VerCompra',
  props : {
    id : String
  },
  data() {
    return {
      items : [],
      compra : {}
    }
  },
  mounted() {
    this.getCompra();
  },
  methods : {
    async getCompra(){
      this.$q.loading.show()
          const query = await db.collection('compras').doc(this.id);
          query.get()
                .then((doc) => {
                  this.compra = {...doc.data()}
                  Object.keys(doc.data().data).forEach(element => {
                    this.items.push({
                      ...doc.data().data[element]
                    })
                  })
                  this.$q.loading.hide()
                })
                
                .catch((error) => {
                  this.$q.loading.hide()
                  this.$q.notify({
                        color: 'red-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: error.message
                  })
                });
      },
  }
}
</script>
