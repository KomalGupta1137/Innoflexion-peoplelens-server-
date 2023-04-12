insert into
    "FileUpload" (
        system,
        sub_system,
        report_name,
        start_date,
        end_date,
        file_path
    )
values
    ($1, $2, $3, $4, $5, $6);