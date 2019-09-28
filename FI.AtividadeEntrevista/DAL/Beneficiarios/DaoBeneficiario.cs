using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DAL
{

    /// <summary>
    /// Classe de acesso a dados de Beneficiário
    /// </summary>
    internal class DaoBeneficiario : AcessoDados
    {
        public SqlDbType Id { get; private set; }

        /// <summary>
        /// Inclui um novo beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        internal long Incluir(DML.Beneficiario beneficiario)
        {
            List<SqlParameter> parametros = new List<SqlParameter>();

            parametros.Add(new SqlParameter("Nome", beneficiario.Nome));
            parametros.Add(new SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new SqlParameter("IDCLIENTE", beneficiario.IdCliente));

            DataSet ds = base.Consultar("FI_SP_IncBeneficiario", parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        /// <summary>
        /// Consulta beneficiários do cliente informado
        /// </summary>
        /// <param name="idCliente">Id do cliente</param>
        internal List<DML.Beneficiario> Listar(long idCliente)
        {
            List<SqlParameter> parametros = new List<SqlParameter>();

            parametros.Add(new SqlParameter("IDCLIENTE", idCliente));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<DML.Beneficiario> beneficiarios = Converter(ds);

            return beneficiarios;
        }

        /// <summary>
        /// Excluir Beneficiário
        /// </summary>
        /// <param name="id">Id do beneficiário</param>
        internal void ExcluirPorCliente(long idCliente)
        {
            List<SqlParameter> parametros = new List<SqlParameter>();

            parametros.Add(new SqlParameter("IDCLIENTE", idCliente));

            base.Executar("FI_SP_DelBeneficiario", parametros);
        }

        /// <summary>
        /// Verifica se existe um registro com o CPF informado para o Id informado
        /// </summary>
        /// <param name="id">Id do cliente</param>
        /// <param name="CPF">CPF do beneficiário</param>
        /// <returns></returns>
        internal bool VerificarExistencia(long id, string CPF)
        {
            List<SqlParameter> parametros = new List<SqlParameter>();

            parametros.Add(new SqlParameter("IdCliente", id));
            parametros.Add(new SqlParameter("CPF", CPF));

            DataSet ds = base.Consultar("FI_SP_VerificaBeneficiario", parametros);

            return ds.Tables[0].Rows.Count > 0;
        }

        private List<DML.Beneficiario> Converter(DataSet ds)
        {
            List<DML.Beneficiario> lista = new List<DML.Beneficiario>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    DML.Beneficiario cli = new DML.Beneficiario();
                    cli.Id = row.Field<long>("Id");
                    cli.Nome = row.Field<string>("Nome");
                    cli.CPF = row.Field<string>("CPF");
                    cli.IdCliente = row.Field<long>("IdCliente");
                    lista.Add(cli);
                }
            }

            return lista;
        }
    }
}
