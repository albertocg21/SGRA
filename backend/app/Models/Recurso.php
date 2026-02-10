<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Reserva;

class Recurso extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'capacity',
        'location',
        'status',
    ];

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'resource_id');
    }
}
