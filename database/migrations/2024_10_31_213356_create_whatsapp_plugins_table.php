<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('whatsapp_plugins', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();

            $table->string('phone'); // diisi oleh pengguna 
            $table->date('expired_date'); // dilakukan pengecekan setiap hari, jika telah memasuki masa kadaluarsa, maka otomatis status is_active => false
            $table->string('url');
            $table->string('appKey');
            $table->string('authkey');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_plugins');
    }
};
