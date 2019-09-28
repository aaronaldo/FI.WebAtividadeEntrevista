function excluirBeneficiario(botao) {
    if (!window.confirm('Deseja realmente excluir este beneficiário?'))
        return;

    $(botao).parent().parent().remove();
}

var linhaAlterar = undefined;

function alterarBeneficiario(botao) {
    var isNormal = $("#divModalAlterar").hasClass('invisible');
    if (isNormal)
        linhaAlterar = $(botao).parent().parent();

    var cpfAtual = $(linhaAlterar).find('td:eq(0)').html();
    var nomeAtual = $(linhaAlterar).find('td:eq(1)').html();

    $("#novoCPFBeneficiario").val(cpfAtual);
    $("#novoNomeBeneficiario").val(nomeAtual);

    exibicaoAlteracao(!isNormal);
}

function exibicaoAlteracao(exibePadrao) {
    if (exibePadrao) {
        $("#divModalAlterar").addClass('invisible');
        $("#divModalInputBase").removeClass('invisible');
        $("#gridBeneficiarios").removeClass('invisible');
    }
    else {
        $("#divModalInputBase").addClass('invisible');
        $("#gridBeneficiarios").addClass('invisible');
        $("#divModalAlterar").removeClass('invisible');
        $("#novoCPFBeneficiario").focus();
    }
}

$(document).ready(function () {
    $("#CPF").mask("999.999.999-99");
    $("#CPFBeneficiario").mask("999.999.999-99");
    $("#novoCPFBeneficiario").mask("999.999.999-99");

    $("#btnBeneficiarios").click(function () {
        $("#divModal").modal();
        $("#CPFBeneficiario").focus();
    });

    $("#btnCancelarAlteracao").click(function () {
        var isNormal = $("#divModalAlterar").hasClass('invisible');

        if (isNormal) 
            linhaAlterar = undefined;

        $("#novoCPFBeneficiario").val('');
        $("#novoNomeBeneficiario").val('');

        exibicaoAlteracao(!isNormal);
    });

    $("#btnAlterarBeneficiario").click(function () {
        var cpf = $("#novoCPFBeneficiario").val();

        if (!ValidaCPF(cpf)) {
            ModalDialog("Ocorreu um erro", "CPF inválido.");
            return;
        }

        var cpfLinha = $(linhaAlterar).find('td:eq(0)').html();
        var tds = $("#gridBeneficiarios").find('table').find('td:contains("' + cpf + '")');
        var cpfJaExiste = tds.length > 0 && cpfLinha != cpf;
        if (cpfJaExiste) {
            ModalDialog("Ocorreu um erro", "CPF já cadastrado.");
            return;
        }

        var nome = $("#novoNomeBeneficiario").val();

        $(linhaAlterar).find('td:eq(0)').html(cpf);
        $(linhaAlterar).find('td:eq(1)').html(nome);

        $("#novoCPFBeneficiario").val('');
        $("#novoNomeBeneficiario").val('');

        exibicaoAlteracao(true);
    });

    $("#btnIncluirBeneficiario").click(function () {
        var cpf = $("#CPFBeneficiario").val();

        if (!ValidaCPF(cpf)) {
            ModalDialog("Ocorreu um erro", "CPF inválido.");
            return;
        }

        var tds = $("#gridBeneficiarios").find('table').find('td:contains("' + cpf + '")');
        var cpfJaExiste = tds.length > 0;
        if (cpfJaExiste) {
            ModalDialog("Ocorreu um erro", "CPF já cadastrado.");
            return;
        }

        var nome = $("#NomeBeneficiario").val();

        var botaoAlterar = '<button type="button" onclick="alterarBeneficiario(this)" class="btn btn-primary btn-sm">Alterar</button>';
        var botaoExcluir = '<button type="button" onclick="excluirBeneficiario(this)" class="btn btn-primary btn-sm">Excluir</button>';
        var linha = '<tr class="jtable-data-row"><td>' + cpf + '</td><td>' + nome + '</td><td>' + botaoAlterar + '</td><td>' + botaoExcluir + '</td></tr>';
        var htmlBody = $("#gridBeneficiarios").find('table').find('tbody').html();
        htmlBody += linha;
        $("#gridBeneficiarios").find('table').find('tbody').html(htmlBody);

        $("#CPFBeneficiario").val('');
        $("#CPFBeneficiario").focus();
        $("#NomeBeneficiario").val('');
    });

    if (document.getElementById("gridBeneficiarios"))
        $('#gridBeneficiarios').jtable({
            paging: false,
            pageSize: 5, // (default: 10)
            sorting: false, //Enable sorting
            actions: {
                listAction: urlBeneficiariosList
            },
            fields: {
                CPF: {
                    title: 'CPF',
                    width: '35%'
                },
                Nome: {
                    title: 'Nome',
                    width: '35%'
                },
                Alterar: {
                    title: '',
                    display: function (data) {
                        return '<button type="button" onclick="alterarBeneficiario(this)" class="btn btn-primary btn-sm">Alterar</button>';
                    }
                },
                Excluir: {
                    title: '',
                    display: function (data) {
                        return '<button type="button" onclick="excluirBeneficiario(this)" class="btn btn-primary btn-sm">Excluir</button>';
                    }
                }
            }
        });

    if (document.getElementById("gridBeneficiarios")) {
        $('#gridBeneficiarios').jtable('load');
        $('#gridBeneficiarios').find(".jtable-no-data-row").remove();
    }

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpf = $(this).find("#CPF").val();
        if (!ValidaCPF(cpf)) {
            ModalDialog("Ocorreu um erro", "CPF inválido.");
            return;
        }

        var trs = $("#gridBeneficiarios").find('table').find('tbody').find('tr');
        var nomesBeneficiarios = [];
        var cpfsBeneficiarios = [];

        for (var i = 0; i < trs.length; i++) {
            var cpfBeneficiario = $(trs[i]).find('td:eq(0)').html();
            var nomeBeneficiario = $(trs[i]).find('td:eq(1)').html();

            nomesBeneficiarios.push(nomeBeneficiario);
            cpfsBeneficiarios.push(cpfBeneficiario);
        }
        
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "CPF": $(this).find("#CPF").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "nomeBeneficiario": nomesBeneficiarios,
                "cpfBeneficiario": cpfsBeneficiarios
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
            }
        });
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
