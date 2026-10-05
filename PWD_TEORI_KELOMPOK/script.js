$(document).ready(function () {

    /* =====================================================
       1. SELEKTOR jQuery
       ===================================================== */

    var $form = $("#formDaftar");
    var $formPanel = $("#formPanel");
    var $hasil = $("#hasil");
    var $ringkasan = $("#ringkasanError");

    var $inputs = $("#formDaftar input, #formDaftar select");


    /* =====================================================
       2. VALIDASI
       ===================================================== */

    var aturan = {

        nama: function (v) {

            v = $.trim(v);

            if (v === "") {
                return "Nama wajib diisi.";
            }

            if (v.length < 3) {
                return "Nama minimal 3 karakter.";
            }

            if (!/^[A-Za-z\s.'-]+$/.test(v)) {
                return "Nama hanya boleh berisi huruf, spasi, titik, atau tanda hubung.";
            }

            return "";
        },


        email: function (v) {

            v = $.trim(v);

            if (v === "") {
                return "Email wajib diisi.";
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
                return "Format email tidak valid. Contoh: nama@email.com";
            }

            return "";
        },


        hp: function (v) {

            v = $.trim(v);

            if (v === "") {
                return "Nomor HP wajib diisi.";
            }

            if (!/^\d+$/.test(v.replace(/^\+/, ""))) {
                return "Nomor HP hanya boleh berisi angka.";
            }

            if (!/^(08|\+?628)/.test(v)) {
                return "Nomor HP harus diawali 08 atau +62.";
            }

            var digit = v.replace(/\D/g, "");

            if (digit.length < 10 || digit.length > 14) {
                return "Nomor HP harus 10–14 digit.";
            }

            return "";
        },


        sesi: function (v) {

            if (v === "") {
                return "Silakan pilih salah satu sesi.";
            }

            return "";
        }

    };


    /* =====================================================
       3. MANIPULASI DOM
       ===================================================== */

    function validasiField(el) {

        var $el = $(el);

        var nama = $el.attr("name");

        var pesan = aturan[nama]($el.val());

        var $wrapper = $el.closest(".field");


        // Menampilkan pesan error
        $("#err-" + nama).text(pesan);

        // Memberikan class invalid jika salah
        $wrapper.toggleClass(
            "invalid",
            pesan !== ""
        );

        // Memberikan class valid jika benar
        $wrapper.toggleClass(
            "valid",
            pesan === ""
        );

        // Memberikan status validasi
        $el.attr(
            "aria-invalid",
            pesan !== ""
        );

        return pesan;
    }


    /* =====================================================
       4. EVENT
       ===================================================== */

    // Validasi ketika selesai mengisi kolom
    $inputs.on("blur", function () {

        validasiField(this);

    });


    // Validasi ketika sedang mengetik
    $inputs.on("input", function () {

        if ($(this)
            .closest(".field")
            .hasClass("invalid")) {

            validasiField(this);
        }

    });


    // Validasi select sesi
    $inputs.on("change", function () {

        validasiField(this);

    });


    /* =====================================================
       5. SUBMIT FORM
       ===================================================== */

    $form.on("submit", function (e) {

        // Mencegah halaman reload
        e.preventDefault();


        var jumlahError = 0;

        var $kolomPertamaSalah = null;


        // Mengecek semua input
        $inputs.each(function () {

            if (validasiField(this) !== "") {

                jumlahError++;

                if (!$kolomPertamaSalah) {
                    $kolomPertamaSalah = $(this);
                }

            }

        });


        // Jika terdapat error
        if (jumlahError > 0) {

            $ringkasan
                .text(
                    "Ada " +
                    jumlahError +
                    " kolom yang perlu diperbaiki sebelum mendaftar."
                )
                .addClass("show");


            // Fokus ke input yang salah pertama
            $kolomPertamaSalah.trigger("focus");

            return;
        }


        // Jika semua data valid
        $ringkasan.removeClass("show");


        tampilkanKartu({

            nama: $.trim($("#nama").val()),

            email: $.trim($("#email").val()),

            hp: $.trim($("#hp").val()),

            sesi: $("#sesi").val()

        });

    });


    /* =====================================================
       6. MEMBUAT NOMOR PENDAFTARAN
       ===================================================== */

    function buatNomor() {

        var acak =
            Math.floor(
                1000 +
                Math.random() * 9000
            );

        return "WWP-2026-" + acak;
    }


    /* =====================================================
       7. MEMBUAT BARIS DATA
       ===================================================== */

    function buatBaris(label, nilai) {

        var $baris = $("<div>", {
            "class": "row"
        });


        $("<span>")
            .text(label)
            .appendTo($baris);


        $("<b>")
            .text(nilai)
            .appendTo($baris);


        return $baris;
    }


    /* =====================================================
       8. MEMBUAT KONFETI
       ===================================================== */

    function hujanKonfeti() {

        var warna = [
            "#7a1237",
            "#b3205a",
            "#ec5b8c",
            "#f8c9da",
            "#4a0a22"
        ];


        for (var i = 0; i < 46; i++) {

            var $c = $("<span>", {
                "class": "confetti"
            }).css({

                left:
                    Math.random() * 100 +
                    "vw",

                background:
                    warna[i % warna.length],

                animationDuration:
                    (2 + Math.random() * 2) +
                    "s",

                animationDelay:
                    (Math.random() * 0.6) +
                    "s"

            });


            $("body").append($c);


            setTimeout(
                (function ($el) {

                    return function () {
                        $el.remove();
                    };

                })($c),

                4500
            );

        }
    }


    /* =====================================================
       9. MENAMPILKAN KARTU KONFIRMASI
       ===================================================== */

    function tampilkanKartu(data) {

        // Menghapus hasil sebelumnya
        $hasil.empty();


        // Membuat kartu
        var $kartu = $("<article>", {
            "class": "ticket"
        });


        /* ---------- Header ---------- */

        var $head = $("<div>", {
            "class": "ticket-head"
        }).html(

            '<div class="check">✓</div>' +

            '<div>' +

            '<h2>Pendaftaran berhasil</h2>' +

            '<p>' +
            'Terima kasih, <span></span>. ' +
            'Anda sudah terdaftar.' +
            '</p>' +

            '</div>'

        );


        // Menampilkan nama peserta
        $head
            .find("span")
            .text(
                data.nama.split(" ")[0]
            );


        /* ---------- Isi data ---------- */

        var $body = $("<div>", {
            "class": "ticket-body"
        }).append(

            buatBaris(
                "Nama",
                data.nama
            ),

            buatBaris(
                "Email",
                data.email
            ),

            buatBaris(
                "No. HP",
                data.hp
            ),

            buatBaris(
                "Sesi",
                data.sesi
            ),

            buatBaris(
                "Acara",
                "Workshop Web Programming"
            )

        );


        /* ---------- Footer ---------- */

        var $foot = $("<div>", {
            "class": "ticket-foot"
        });


        // Nomor pendaftaran
        var $no = $("<div>", {
            "class": "reg-no"
        }).text(
            buatNomor()
        );


        // Catatan
        var $catatan = $("<p>", {
            "class": "note"
        }).text(
            "Tunjukkan kartu ini saat registrasi ulang di lokasi."
        );


        // Tombol cetak
        var $btnCetak = $("<button>", {

            type: "button",

            "class": "btn"

        })
        .text("Cetak kartu")

        .on("click", function () {

            window.print();

        });


        // Tombol daftar peserta lain
        var $btnUlang = $("<button>", {

            type: "button",

            "class": "btn ghost"

        })
        .text("Daftarkan peserta lain")

        .on("click", function () {

            resetHalaman();

        });


        // Masukkan semua elemen ke footer
        $foot.append(
            $no,
            $catatan,
            $btnCetak,
            $btnUlang
        );


        // Masukkan header, body dan footer ke kartu
        $kartu.append(
            $head,
            $body,
            $foot
        );


        // Tampilkan kartu
        $hasil.append($kartu);


        // Sembunyikan form
        $formPanel.hide();


        // Scroll ke kartu
        $("html, body").animate({

            scrollTop:
                $kartu.offset().top - 20

        }, 400);


        // Jalankan konfeti
        hujanKonfeti();

    }


    /* =====================================================
       10. RESET HALAMAN
       ===================================================== */

    function resetHalaman() {

        $hasil.empty();

        $form[0].reset();

        $(".field")
            .removeClass("valid invalid");

        $(".error-msg")
            .text("");

        $formPanel.show();

        $("#nama").trigger("focus");

    }

});