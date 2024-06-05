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
        Schema::create('organization_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('no_ref');
            $table->enum('product', ['Bulanan', 'Tahunan']);
            $table->string('description')->nullable();
            $table->enum('status', ['paid', 'pending', 'canceled']);
            $table->integer('price');
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organization_invoices');
    }
};
