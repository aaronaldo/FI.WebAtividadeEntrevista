﻿ALTER PROC FI_SP_VerificaCliente
	@ID int,
	@CPF VARCHAR(14)
AS
BEGIN
	SELECT 1 FROM CLIENTES WHERE CPF = @CPF AND ID <> @ID
END