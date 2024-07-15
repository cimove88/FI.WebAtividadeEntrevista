
$(document).ready(function () {

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: $(this).serializeArray(),
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 409)
                        ModalDialog("Conflito de registro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                }
        });
    });
});

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

function ModalBeneficiarios() {
    $('#modalBeneficiarios').modal('show');
}

function getInputsCPFBeneficiarios() {
    return $('#formCadastro').serializeArray().filter(function (v) {
            return v.name && v.name.includes("Beneficiarios[") && v.name.endsWith("].CPF");
    });
}

function getInputsNomeBeneficiarios() {
    return $('#formCadastro').serializeArray().filter(function (v) {
        return v.name && v.name.includes("Beneficiarios[") && v.name.endsWith("].Nome");
    });
}

function contemBeneficiario(cpf) {
    return getInputsCPFBeneficiarios().find(x => x.value == cpf);
}

function refreshTableBeneficiarios() {
    var cpfs = getInputsCPFBeneficiarios();
    var nomes = getInputsNomeBeneficiarios();

    $("#TableBeneficiarios tbody").empty();

    for (var i = 0; i < cpfs.length; i++) {

        var row = $("<tr>");
        
        row.append($("<td>").text(cpfs[i].value));
        row.append($("<td>").text(nomes[i].value));
        row.append($("<td>").html("<button type='button' class='btn btn-sm btn-primary' onclick='AlterarBeneficiario(" + i + ")'>Alterar</button> <button type='button' class='btn btn-sm btn-primary' onclick='ExcluirBeneficiario(" + i +")'>Excluir</button>"));

        $("#TableBeneficiarios tbody").append(row);
    }
}

function IncluirBeneficiario() {
    var inputCpfBeneficiario = $("#CPFBeneficiario");
    var inputNomeBeneficiario = $("#NomeBeneficiario");

    if (contemBeneficiario(inputCpfBeneficiario.val())) {
        alert("Já contém o Beneficiário");
        return;
    }

    var quantidadeBeneficiarios = getInputsNomeBeneficiarios().length;

    var hiddenCpfBeneficiario = $('<input>').attr({
        type: 'hidden',
        name: 'Beneficiarios[' + quantidadeBeneficiarios + '].CPF',
        value: inputCpfBeneficiario.val()
    });

    var hiddenNomeBeneficiario = $('<input>').attr({
        type: 'hidden',
        name: 'Beneficiarios[' + quantidadeBeneficiarios + '].Nome',
        value: inputNomeBeneficiario.val()
    });

    $('#formCadastro').append(hiddenCpfBeneficiario);
    $('#formCadastro').append(hiddenNomeBeneficiario);

    inputCpfBeneficiario.val("");
    inputNomeBeneficiario.val("");

    refreshTableBeneficiarios();
}

function ExcluirBeneficiario(id) {

    var hiddenCpfBeneficiario = $("#formCadastro input[name='Beneficiarios[" + id + "].CPF']");
    var hiddenNomeBeneficiario = $("#formCadastro input[name='Beneficiarios[" + id + "].Nome']");

    hiddenCpfBeneficiario.remove();
    hiddenNomeBeneficiario.remove();

    refreshTableBeneficiarios();
}

function AlterarBeneficiario(id) {

    var hiddenCpfBeneficiario = $("#formCadastro input[name='Beneficiarios[" + id + "].CPF']");
    var hiddenNomeBeneficiario = $("#formCadastro input[name='Beneficiarios[" + id + "].Nome']");

    var inputCpfBeneficiario = $("#CPFBeneficiario");
    var inputNomeBeneficiario = $("#NomeBeneficiario");

    inputCpfBeneficiario.val(hiddenCpfBeneficiario.val());
    inputNomeBeneficiario.val(hiddenNomeBeneficiario.val());

    hiddenCpfBeneficiario.remove();
    hiddenNomeBeneficiario.remove();

    refreshTableBeneficiarios();
}