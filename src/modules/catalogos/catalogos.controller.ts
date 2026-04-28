import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

export class CatalogosController {
  constructor(private readonly db: PrismaClient) {}

  getProvincias    = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.provincia.findMany({ orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getCiudades      = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.ciudad.findMany({ include: { provincia: true }, orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getMarcas        = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.marca.findMany({ orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getModelos       = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.modelo.findMany({ include: { marca: true }, orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getCategorias    = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.categoria.findMany({ orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getCombustibles  = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.tipoCombustible.findMany({ orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getTransmisiones = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.tipoTransmision.findMany({ orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getExtras        = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.extraEquipamiento.findMany({ where: { isActive: true }, orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getSeguros       = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.seguro.findMany({ where: { isActive: true }, orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getTarifas       = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.tarifa.findMany({ include: { categoria: true }, orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getCanalesVenta  = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.canalVenta.findMany({ orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };
  getSistemasExternos = async (_: Request, res: Response, next: NextFunction) => { try { res.json({ success: true, data: await this.db.sistemaExterno.findMany({ orderBy: { nombre: 'asc' } }) }); } catch (e) { next(e); } };

  getEstadosVehiculo = (_: Request, res: Response): void => {
    res.json({
      success: true,
      data: [
        { value: 'DISPONIBLE',    label: 'Disponible' },
        { value: 'RESERVADO',     label: 'Reservado' },
        { value: 'EN_USO',        label: 'En uso' },
        { value: 'MANTENIMIENTO', label: 'En mantenimiento' },
        { value: 'INACTIVO',      label: 'Inactivo' },
      ],
    });
  };
}
