using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        /// <summary>
        /// Inclui um novo beneficiario
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        public long Incluir(DML.Beneficiario beneficiario)
        {
            DAL.DaoBeneficiario cli = new DAL.DaoBeneficiario();
            return cli.Incluir(beneficiario);
        }

        /// <summary>
        /// Excluir o beneficiario pelo id do cliente
        /// </summary>
        /// <param name="idCliente">id do cçoemte</param>
        /// <returns></returns>
        public void ExcluirPorCliente(long idCliente)
        {
            DAL.DaoBeneficiario cli = new DAL.DaoBeneficiario();
            cli.ExcluirPorCliente(idCliente);
        }

        /// <summary>
        /// Lista os beneficiarios
        /// </summary>
        public List<DML.Beneficiario> Listar(long idCliente)
        {
            DAL.DaoBeneficiario cli = new DAL.DaoBeneficiario();
            return cli.Listar(idCliente);
        }

        /// <summary>
        /// VerificaExistencia
        /// </summary>
        /// <param name="CPF"></param>
        /// <returns></returns>
        public bool VerificarExistencia(long id, string CPF)
        {
            DAL.DaoBeneficiario cli = new DAL.DaoBeneficiario();
            return cli.VerificarExistencia(id, CPF);
        }
    }
}