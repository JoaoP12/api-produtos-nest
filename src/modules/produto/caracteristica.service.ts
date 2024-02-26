import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TipoCaracteristica } from '../../entities/tipo_caracteristica.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { TipoCaracteristicaDTO } from './dto/tipoCaracteristica.dto';
import { AtualizarTipoCaracteristicaDTO } from './dto/atualizarTipoCaracteristica.dto';
import { CaracteristicaDTO } from './dto/caracteristica.dto';
import { AtualizarCaracteristicaDTO } from './dto/atualizarCaracteristica.dto';
import { Caracteristica } from '../../entities/caracteristica.entity';
import { CaracteristicaProduto } from '../../entities/caracteristica_produto.entity';

@Injectable()
export class CaracteristicaService {
  constructor(
    @InjectRepository(TipoCaracteristica)
    private tipoCaracteristicaRepository: Repository<TipoCaracteristica>,
    @InjectRepository(Caracteristica)
    private caracteristicaRepository: Repository<Caracteristica>,
    @InjectRepository(CaracteristicaProduto)
    private caracteristicaProdutoRepository: Repository<CaracteristicaProduto>,
  ) {}

  async listarTiposCaracteristicas(): Promise<TipoCaracteristica[]> {
    return this.tipoCaracteristicaRepository.find();
  }

  async cadastrarTipoCaracteristica(tipoCaracteristica: TipoCaracteristicaDTO): Promise<TipoCaracteristica> {
    const nomeExistente = await this.tipoCaracteristicaRepository.exists({
      where: { nome: ILike(tipoCaracteristica.nome) },
    });

    if (nomeExistente) {
      throw new BadRequestException(`Já existe um tipo de característica com o nome ${tipoCaracteristica.nome}`);
    }

    return await this.tipoCaracteristicaRepository.save(tipoCaracteristica as TipoCaracteristica);
  }

  async atualizarTipoCaracteristica(tipoCaracteristica: AtualizarTipoCaracteristicaDTO): Promise<TipoCaracteristica> {
    const tipoExistente = await this.tipoCaracteristicaRepository.exists({
      where: { idTipoCaracteristica: tipoCaracteristica.idTipoCaracteristica },
    });

    if (!tipoExistente) {
      throw new NotFoundException('Tipo de característica não encontrado');
    }

    const nomeExistente = await this.tipoCaracteristicaRepository.exists({
      where: {
        nome: ILike(tipoCaracteristica.nome),
        idTipoCaracteristica: Not(tipoCaracteristica.idTipoCaracteristica),
      },
    });

    if (nomeExistente) {
      throw new BadRequestException(`Já existe um tipo de característica com o nome ${tipoCaracteristica.nome}`);
    }

    return await this.tipoCaracteristicaRepository.save(tipoCaracteristica as TipoCaracteristica);
  }

  async listarCaracteristicas(idTipoCaracteristica: number) {
    return await this.caracteristicaRepository.find({ where: { idTipoCaracteristica } });
  }

  async cadastrarCaracteristica({ idTipoCaracteristica, nome }: CaracteristicaDTO) {
    const caracteristicaExistente = await this.caracteristicaRepository.exists({
      where: { idTipoCaracteristica, nome: ILike(nome) },
    });

    if (caracteristicaExistente) {
      throw new BadRequestException(
        `Já existe uma característica com o nome ${nome} para o tipo de característica informado`,
      );
    }

    return await this.caracteristicaRepository.save({ idTipoCaracteristica, nome } as CaracteristicaDTO);
  }

  async atualizarCaracteristica({ idCaracteristica, idTipoCaracteristica, nome }: AtualizarCaracteristicaDTO) {
    const caracteristicaExistente = await this.caracteristicaRepository.exists({ where: { idCaracteristica } });
    if (!caracteristicaExistente) {
      throw new NotFoundException('Característica não encontrada');
    }

    const nomeExistente = await this.caracteristicaRepository.exists({
      where: { idTipoCaracteristica, nome: ILike(nome), idCaracteristica: Not(idCaracteristica) },
    });

    if (nomeExistente) {
      throw new BadRequestException(
        `Já existe uma característica com o nome ${nome} para o tipo de característica informado`,
      );
    }

    return await this.caracteristicaRepository.save({
      idCaracteristica,
      idTipoCaracteristica,
      nome,
    } as CaracteristicaDTO);
  }

  async consultarCaracteristicaPorId(idCaracteristica: number): Promise<Caracteristica> {
    return await this.caracteristicaRepository.findOne({ where: { idCaracteristica } });
  }

  async verificaExistenciaCaracteristicaProduto(idCaracteristica: number, idProduto: number): Promise<boolean> {
    return await this.caracteristicaProdutoRepository.exists({ where: { idCaracteristica, idProduto } });
  }

  async consultarNumeroCaracteristicasProduto(idProduto: number): Promise<number> {
    const numCaracteristicas = await this.caracteristicaProdutoRepository.count({ where: { idProduto } });
    return numCaracteristicas;
  }

  async removerCaracteristicaProduto(idCaracteristica: number, idProduto: number): Promise<void> {
    await this.caracteristicaProdutoRepository.delete({ idCaracteristica, idProduto });
  }

  async salvarCaracteristicaProduto(idCaracteristica: number, idProduto: number): Promise<void> {
    await this.caracteristicaProdutoRepository.save({ idCaracteristica, idProduto });
  }
}
