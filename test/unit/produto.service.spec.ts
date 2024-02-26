import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../../src/entities/produto.entity';
import { ProdutoAssociado } from '../../src/entities/produto_associado.entity';
import { CaracteristicaService } from '../../src/modules/produto/caracteristica.service';
import { TipoProduto } from '../../src/modules/produto/enum/tipoProduto.enum';
import { ProdutoService } from '../../src/modules/produto/produto.service';
import { getProdutoTeste } from '../utils/getProdutoTeste';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let produtoRepository: Repository<Produto>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: getDataSourceToken(),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Produto),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            exists: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ProdutoAssociado),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            exists: jest.fn(),
          },
        },
        {
          provide: CaracteristicaService,
          useValue: {
            cadastrarCaracteristica: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
    produtoRepository = module.get(getRepositoryToken(Produto));
  });

  describe('cadastrarProduto()', () => {
    it('should throw an error if produto already exists', async () => {
      const produtoReq = getProdutoTeste();
      jest.spyOn(produtoRepository, 'exists').mockResolvedValueOnce(true);

      const exec = service.cadastrarProduto(produtoReq);

      await expect(exec).rejects.toThrow(BadRequestException);
    });

    it('should save and return a new produto if produto do not exist', async () => {
      const produtoReq = getProdutoTeste();
      jest.spyOn(produtoRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(produtoRepository, 'save').mockResolvedValueOnce(produtoReq as Produto);

      const result = await service.cadastrarProduto(produtoReq);

      expect(result).toEqual(produtoReq);
      expect(produtoRepository.save).toHaveBeenCalledWith(produtoReq);
    });

    it('should call cadastrarProdutoSimplesDigital when produto is of type SIMPLES', async () => {
      const produtoReq = getProdutoTeste();
      jest.spyOn(produtoRepository, 'exists').mockResolvedValueOnce(null);
      jest.spyOn(produtoRepository, 'save').mockResolvedValueOnce(produtoReq as Produto);
      jest.spyOn(service as any, 'cadastrarProdutoSimplesDigital').mockResolvedValueOnce(produtoReq as Produto);

      const result = await service.cadastrarProduto(produtoReq);

      expect(result).toEqual(produtoReq);
      expect((service as any).cadastrarProdutoSimplesDigital).toHaveBeenCalledWith(produtoReq);
    });

    it('should call cadastrarProdutoSimplesDigital when produto is of type DIGITAL', async () => {
      const produtoReq = getProdutoTeste();
      produtoReq.tipoProduto = TipoProduto.DIGITAL;
      jest.spyOn(produtoRepository, 'exists').mockResolvedValueOnce(null);
      jest.spyOn(produtoRepository, 'save').mockResolvedValueOnce(produtoReq as Produto);
      jest.spyOn(service as any, 'cadastrarProdutoSimplesDigital').mockResolvedValueOnce(produtoReq as Produto);

      const result = await service.cadastrarProduto(produtoReq);

      expect(result).toEqual(produtoReq);
      expect((service as any).cadastrarProdutoSimplesDigital).toHaveBeenCalledWith(produtoReq);
    });

    it('should call cadastrarProdutoAgrupado when produto is of type AGRUPADO', async () => {
      const produtoReq = getProdutoTeste();
      produtoReq.tipoProduto = TipoProduto.AGRUPADO;
      jest.spyOn(produtoRepository, 'exists').mockResolvedValueOnce(null);
      jest.spyOn(produtoRepository, 'save').mockResolvedValueOnce(produtoReq as Produto);
      jest.spyOn(service as any, 'cadastrarProdutoAgrupado').mockResolvedValueOnce(produtoReq as Produto);

      const result = await service.cadastrarProduto(produtoReq);

      expect(result).toEqual(produtoReq);
      expect((service as any).cadastrarProdutoAgrupado).toHaveBeenCalledWith(produtoReq);
    });

    it('should call cadastrarProdutoConfiguravel when produto is of type CONFIGURAVEL', async () => {
      const produtoReq = getProdutoTeste();
      produtoReq.tipoProduto = TipoProduto.CONFIGURAVEL;
      jest.spyOn(produtoRepository, 'exists').mockResolvedValueOnce(null);
      jest.spyOn(produtoRepository, 'save').mockResolvedValueOnce(produtoReq as Produto);
      jest.spyOn(service as any, 'cadastrarProdutoConfiguravel').mockResolvedValueOnce(produtoReq as Produto);

      const result = await service.cadastrarProduto(produtoReq);

      expect(result).toEqual(produtoReq);
      expect((service as any).cadastrarProdutoConfiguravel).toHaveBeenCalledWith(produtoReq);
    });
  });
});
